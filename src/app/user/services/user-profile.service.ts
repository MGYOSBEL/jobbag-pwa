import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { UserProfile } from '../models/user.model';
import { of, Observable, throwError } from 'rxjs';
import { APIResponse } from '@app/models/app.model';
import { UserModule } from '../user.module';
import { UserCacheService } from './user-cache.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private apiPath = environment.apiBaseURL;



  constructor(
    private http: HttpClient,
    private userCacheService: UserCacheService,
    private userService: UserService
  ) { }



  get(id: number): Observable<UserProfile> {
    // Leo el array de userProfiles del storage
    const userProfiles: Array<UserProfile> = JSON.parse(localStorage.getItem('userProfiles')) || [];
    if (userProfiles.length) {
      console.log('No lo pidio');
      for (const iterator of userProfiles) {
        if (iterator.id === id) { // Recorro el array y si esta el perfil que busco lo retorno como un observable
          return of(iterator);
        }
      }
    } else {
      console.log('Lo pidio');

      return this.http.get<APIResponse>(this.apiPath + '/user_profile/' + id).pipe(
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
        tap(content => { // Si se ejecuta el tap es porque no se lanzo antes ningun error, por lo tanto status===200(OK)
          userProfiles.push(content);
          localStorage.setItem('userProfiles', JSON.stringify(userProfiles));
        })
      );
    }
  }

  // public get serviceProvider(): UserProfile {
  //   const profiles: Array<UserProfile> = JSON.parse(localStorage.getItem('userProfiles'));
  //   const activeProfile: UserProfile = profiles.find(elem => elem.userProfileType === 'SERVICE_PROVIDER');
  //   return activeProfile;    // return profiles.find(elem => elem.userProfileType === 'SERVICE_PROVIDER');
  // }

  // public get client(): UserProfile {
  //   const profiles: Array<UserProfile> = JSON.parse(localStorage.getItem('userProfiles'));
  //   const activeProfile: UserProfile = profiles.find(elem => elem.userProfileType === 'CLIENT');
  //   return activeProfile;    // return profiles.find(elem => elem.userProfileType === 'SERVICE_PROVIDER');
  //   // return profiles.find(elem => elem.userProfileType === 'CLIENT');
  // }



  getAll() { }

  create(data: any): Observable<UserProfile> {
    let userProfiles: Array<UserProfile>;
    userProfiles = this.userCacheService.getProfiles(); // Leo los profiles del localstorage.
    if (userProfiles) {
      if (!!userProfiles.find(profile => profile.userProfileType === data.user_profile_type)) {
        return throwError('403: Forbidden. You can not have more than two profiles.');
        // Si solo hay un perfil, pero es del tipo del que se quiere crear
        // tampoco se puede crear. Se lanza un error
      }
    }
    console.log(data);
    return this.http.post<APIResponse>(this.apiPath + '/user_profile', data).pipe(
      map(response => {
        console.log(response);
        if (response.status_code === 200) { // Si el status del response es OK retorno contento como dato del observable
          return JSON.parse(JSON.parse(response.content));
        } else {
          return throwError( // Si no es OK el status del response, lanzo un error con el status y el text
            response.status_code + ': ' + (JSON.parse(response.content)).text
          );
        }
      }),
      catchError(err => { // Captura si hubo algun error en la llamada y lo relanza
        return throwError(err.error.status + ': ' + err.error.detail);  // Relanzo el error con el status y el detail
      }),
      tap((content: UserProfile) => { // Si se ejecuta el tap es porque no se lanzo antes ningun error, por lo tanto status===200(OK)
        console.log('content', content);
        userProfiles.push(content);
        console.log('userProfiles', userProfiles);
        this.userCacheService.setProfiles(userProfiles); // Se guarda el arreglo de userProfiles en el localStorage
      })
    );
  }

  edit(data: any): Observable<UserProfile> {
    console.log('editProfileMethod Data: ', JSON.stringify(data));
    return this.http.put<APIResponse>(this.apiPath + '/user_profile', data)
      .pipe(
        map(response => {
          console.log('editCompleteResponse: ', response);
          const content = JSON.parse(response.content); // Seleccionar la parte del response q es el contenido
          if (response.status_code === 200) {
            console.log('edit response: ', content);
            return content; // Retorno el content del response como cuerpo del observable
          } else { // Si no fue OK el status del response lanzo un error con el status code y el text del response.
            return throwError(
              response.status_code + ': ' + response.content.text
            );
          }
        }),
        catchError(err => { // Captura si hubo algun error en la llamada y lo relanza
          return throwError(err.error.status + ': ' + err.error.detail);  // Relanzo el error con el status y el detail
        }),
        tap((content: UserProfile) => {
          let profiles = this.userCacheService.getProfiles(); // Leo los profiles del localStorage
          const index = profiles.findIndex(profile => profile.id === content.id);
          profiles[index] = content;
          // Una vez modificados los campos salvo el array completo de userProfiles
          this.userCacheService.setProfiles(profiles);

        }
        ));
  }

  delete(id: number): Observable<any> {
    const req = {
      id: id,
      client_secret: environment.clientSecret,
      client_id: environment.clientId
    };
    return this.http.request<APIResponse>('DELETE', this.apiPath + '/user_profile', { body: req }).pipe(
      map(response => {
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
        let userProfiles: UserProfile[] = this.userCacheService.getProfiles();

        userProfiles.splice(userProfiles.findIndex(elem => elem.id === id), 1); // Cuando encuentro el id, elimino el elemento

        console.log('profiles after delete', userProfiles);
        this.userCacheService.setProfiles(userProfiles);
      })
    );
  }



}
