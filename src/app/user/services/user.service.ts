import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User, Scholarship, UserProfile, Briefcase } from '../models/user.model';
import { LoggingService } from '@app/services/logging.service';
import { environment } from '@environments/environment';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _loggedUser: User;
  apiPath = environment.apiBaseURL;


  constructor(private http: HttpClient,
              private logging: LoggingService) { }


  public get loggedUser() {
    return JSON.parse(localStorage.getItem('loggedUser'));
  }


  get(userId: string): Observable<User> {
    // const user_id = JSON.parse(localStorage.getItem('bearerToken')).user_id;
    return this.http.get<any>(this.apiPath + '/user/get/' + userId).pipe(
      catchError(err => { // Captura si hubo algun error en la llamada y lo relanza
        throw new Error(err);  // Relanzo el error con el status y el detail
      }), // El metodo user/get/{id} retorna los datos directos, no en content. Por lo tanto no hago ningun map aca.
      tap((response) => {
        this._loggedUser = response; // Salvo el user en el storage
        localStorage.setItem('loggedUser', JSON.stringify({
          id: response.id,
          username: response.username,
          email: response.email
        }));
        if (response.user_profiles.length) {
          const userProfiles: Array<any> = response.user_profiles; // Salvo los userProfiles en el Storage
          let profilesForStorage: Array<any> = [];
          for (const iterator of userProfiles) {
            profilesForStorage.push({
              id: iterator.id,
              phone_number: iterator.phone_number,
              comment: iterator.comment,
              summary: iterator.summary,
              user_id: iterator.user_id,
              scholarship_id: iterator.scholarship_id,
              user_profile_type: iterator.id_user_profile_type_fk.type
            });
          }
          localStorage.setItem('userProfiles', JSON.stringify(profilesForStorage));
          console.log(userProfiles);
          const index = userProfiles.findIndex(elem => elem.user_profile_type === 'SERVICE_PROVIDER');
          console.log('index', index);
          if (index >= 0) {
            const briefcases: Array<any> = userProfiles[index].user_profile_briefcases || []; // Salvo los briefcases en el Storage
            let briefcasesForStorage: Array<any> = [];
            for (const iterator of briefcases) {
              briefcasesForStorage.push({
                id: iterator.id,
                comments: iterator.comments,
                description: iterator.description,
                start_date: iterator.start_date,
                end_date: iterator.end_date,
                id_profession: iterator.id_profession
              });
            }
            localStorage.setItem('briefcases', JSON.stringify(briefcasesForStorage));

          }
        } else { // No hay ningun perfil creado, guardo los arrays vacios
          localStorage.setItem('userProfiles', JSON.stringify([]));
          localStorage.setItem('briefcases', JSON.stringify([]));
        }
      })
    );
  }

  edit(data: any) {
    console.log('data request: ' ,  data);
    return this.http.put<any>(this.apiPath + '/user', data).pipe(
      map(response => {
        const content = JSON.parse(response.content);
        console.log(content);
        if (response.status_code === 200) {
          localStorage.setItem('User', JSON.stringify(data.user));
          return content;
        } else {
          return {
            error: true,
            statusCode: response.status_code,
            text: response.content.text
          };
        }
      }, err => {
        console.log('SERVER ERROR!!!!!');
        console.log(err);
      }),
      tap(response => {
        console.log('data response ' , response);
        if (!response.error) {
          localStorage.setItem('loggedUser', (response));
        }
      })
    );
  }

  delete(userId: string) {

  }


  getRoles() {
    return this.loggedUser.roles;
  }



}
