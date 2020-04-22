import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { UserProfileBriefcase } from '../models/user.model';
import { APIResponse } from '@app/models/app.model';
import { UserCacheService } from './user-cache.service';
import { UserService } from './user.service';
import { LoggingService } from '@app/services/logging.service';
import { AuthenticationService } from '@app/auth/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class BriefcaseService {

  apiPath = environment.apiBaseURL;

  private subject = new BehaviorSubject<UserProfileBriefcase[]>([]);

  briefcases$ = this.subject.asObservable();

  // Briefcases storaged in the service
  briefcases: UserProfileBriefcase[] = [];

  idCounter: number;

  // ChangeLog of the briefcases
  addBriefcases: UserProfileBriefcase[] = [];
  deleteBriefcases: UserProfileBriefcase[] = [];
  editBriefcases: UserProfileBriefcase[] = [];

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private userCacheService: UserCacheService) {

    this.briefcases = this.userCacheService.getBriefcases();
    this.subject.next(this.briefcases);
    this.idCounter = this.briefcases.length;

    this.authenticationService.isLoggedIn$.subscribe(
      loggedIn => {
        if (!loggedIn) {
          this.briefcases = [];
          this.subject.next([]);
          this.addBriefcases = [];
          this.deleteBriefcases = [];
          this.editBriefcases = [];
        }
      }
    );

  }

  // COMPONENTS PURPOSE INTERFACE
  addLocal(briefcase: UserProfileBriefcase): boolean {
    briefcase.id = 0 - (++this.idCounter);
    this.briefcases.push(briefcase);
    // Saved to the changeLog
    this.addBriefcases.push(briefcase);
    this.subject.next(this.briefcases);
    return true;
  }

  deleteLocal(briefcase: UserProfileBriefcase): boolean {
    // delete it from the storage array
    const index = this.briefcases.findIndex(item => item.id === briefcase.id);
    if (index !== -1) {
      this.briefcases.splice(index, 1);
      this.subject.next(this.briefcases);
    } else { return false; }

    // add it to the change log
    this.deleteBriefcases.push(briefcase);

    // delete it from previous change logs
    const indexAdd = this.addBriefcases.findIndex(item => item.id === briefcase.id);
    if (indexAdd !== -1) {
      this.addBriefcases.splice(indexAdd, 1);
    }
    const indexEdit = this.editBriefcases.findIndex(item => item.id === briefcase.id);
    if (indexEdit !== -1) {
      this.editBriefcases.splice(indexEdit, 1);
    }
    return true;

  }

  editLocal(briefcase: UserProfileBriefcase): boolean {
    const index = this.briefcases.findIndex(item => item.id === briefcase.id);
    console.log(index);
    if (index !== -1) {
      this.briefcases[index] = briefcase;
      console.log(this.briefcases[index]);

      this.subject.next(this.briefcases);
      console.log('subject', this.subject.value);
    } else { return false; }

    // Update change Log
    const indexEdit = this.editBriefcases.findIndex(item => item.id === briefcase.id);
    if (indexEdit !== -1) { // Si esta lo modifico
      this.editBriefcases[indexEdit] = briefcase;
    } else { // Si no esta lo agrego
      this.editBriefcases.push(briefcase);
    }

    const indexAdd = this.addBriefcases.findIndex(item => item.id === briefcase.id);
    if (indexAdd !== -1) {
      this.addBriefcases.splice(indexAdd, 1);
    }

    return true;

  }

  getlocals(): UserProfileBriefcase[] {
    return this.briefcases;
  }

  getChangeLog() {
    return {
      added: this.addBriefcases,
      edited: this.editBriefcases,
      deleted: this.deleteBriefcases
    };
  }

  // API PURPOSE INTERFACE
  get(id: number) {
    const briefcases: Array<UserProfileBriefcase> = JSON.parse(localStorage.getItem('briefcases')) || []; // Leo el array de userProfiles del storage
    if (briefcases) {
      for (const iterator of briefcases) {
        if (iterator.id === id) { // Recorro el array y si esta el perfil que busco lo retorno como un observable
          return of(iterator);
        }
      }
    }
    return this.http.get<APIResponse>(this.apiPath + '/briefcase/' + id).pipe(
      catchError(err => { // Captura si hubo algun error en la llamada y lo relanza
        throw new Error(err.error.status + ': ' + err.error.detail);  // Relanzo el error con el status y el detail
      }),
      map(response => {
        if (response.status_code === 200) { // Si el status del response es OK retorno contento como dato del observable
          return JSON.parse(response.content);
        } else {
          throw new Error( // Si no es OK el status del response, lanzo un error con el status y el text
            response.status_code + ': ' + response.content.text
          );
        }
      }),
      tap((content: UserProfileBriefcase) => { // Si se ejecuta el tap es porque no se lanzo antes ningun error, por lo tanto status===200(OK)
        briefcases.push(content);
        localStorage.setItem('briefcases', JSON.stringify(briefcases));

      })
    );

  }

  getAll(): Observable<UserProfileBriefcase[]> {
    // Leo el array de userProfiles del storage
    const briefcases: UserProfileBriefcase[] = this.userCacheService.getBriefcases();
    return of(briefcases);
  }

  create(userProfileId: number, briefcase: any): Observable<UserProfileBriefcase> {
    const data = {
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      user_profile_id: userProfileId,
      briefcase
    };
    console.log('briefcase request: ', data);
    return this.http.post<APIResponse>(this.apiPath + '/briefcase', data).pipe(
      map(response => {
        console.log('bc_create response: ', response);
        if (response.status_code === 200) { // Si el status del response es OK retorno contento como dato del observable
          return JSON.parse(JSON.parse(response.content));
        } else {
          return throwError( // Si no es OK el status del response, lanzo un error con el status y el text
            response.status_code + ': ' + response.content.text
          );
        }
      }),
      catchError(err => {
        return throwError(err.error.status + ': ' + err.error.detail);
      }),
      tap((content: UserProfileBriefcase) => { // Salvo el contenido del nuevo briefcase en el localStorage
        console.log('content: ', content);
        let briefcases: UserProfileBriefcase[] = this.userCacheService.getBriefcases();
        briefcases.push(content);
        this.userCacheService.setBriefcases(briefcases);
        this.subject.next(this.briefcases);

      })
    );
  }

  edit(userProfileId: number, briefcase: any): Observable<UserProfileBriefcase> {
    const data = {
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      user_profile_id: userProfileId,
      briefcase
    };
    console.log(data);
    return this.http.put<APIResponse>(this.apiPath + '/briefcase', data).pipe(
      map(response => {
        const content = JSON.parse(response.content); // Seleccionar la parte del response q es el contenido
        console.log('content: ', content);
        if (response.status_code === 200) {
          return content; // Retorno el content del response como cuerpo del observable
        } else { // Si no fue OK el status del response lanzo un error con el status code y el text del response.
          return throwError(
            response.status_code + ': ' + response.content.text
          );
        }
      }),
      catchError(err => {
        return throwError(err.error.status + ': ' + err.error.detail);
      }),

      tap((content: UserProfileBriefcase) => {
        // Leo los profiles del localStorage
        let briefcases: UserProfileBriefcase[] = this.userCacheService.getBriefcases();
        const index = briefcases.findIndex(elem => elem.id === briefcase.id);
        console.log('index', index);
        console.log('briefcases', briefcases);
        briefcases[index] = content;
        // Una vez modificados los campos salvo el array completo de userProfiles
        this.userCacheService.setBriefcases(briefcases);
        this.subject.next(this.briefcases);

      }
      ));
  }

  delete(id: number): Observable<any> {
    const req = {
      briefcase: {
        id
      },
      client_secret: environment.clientSecret,
      client_id: environment.clientId
    };
    console.log(req);
    return this.http.request<APIResponse>('DELETE', this.apiPath + '/briefcase', { body: req }).pipe(
      map(response => {
        console.log(response);
        if (response.status_code === 200) { // Si el status del response es OK retorno contento como dato del observable
          return JSON.parse(response.content);
        } else {
          return throwError( // Si no es OK el status del response, lanzo un error con el status y el text
            response.status_code + ': ' + response.content.text
          );
        }
      }),
      catchError(err => { // Captura si hubo algun error en la llamada y lo relanza
        return throwError(err.error.status + ': ' + err.error.detail);  // Relanzo el error con el status y el detail
      }),
      tap(content => { // Si se ejecuta el tap es porque no se lanzo antes ningun error, por lo tanto status===200(OK)
        // Leo el array del storage para actualizarlo
        let briefcases: UserProfileBriefcase[] = this.userCacheService.getBriefcases() || [];
        briefcases.splice(briefcases.findIndex(elem => elem.id === id), 1); // Cuando encuentro el id, elimino el elemento
        this.userCacheService.setBriefcases(briefcases);
        this.subject.next(this.briefcases);

      })
    );
  }
}
