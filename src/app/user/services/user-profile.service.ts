import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { BriefcaseService } from './briefcase.service';
import { UserProfile, Briefcase } from '../models/user.model';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private apiPath = environment.apiBaseURL;



  constructor(private http: HttpClient
              ) { }



  get(id: string) {
    const userProfiles: Array<any> = JSON.parse(localStorage.getItem('userProfiles')) || []; // Leo el array de userProfiles del storage
    if (userProfiles.length) {
      console.log('No lo pidio');
      for (const iterator of userProfiles) {
        if (iterator.id === id) { // Recorro el array y si esta el perfil que busco lo retorno como un observable
          return of(iterator);
        }
      }
    } else {
      console.log('Lo pidio');

      return this.http.get<any>(this.apiPath + '/user_profile/' + id).pipe(
        catchError(err => { // Captura si hubo algun error en la llamada y lo relanza
          throw new Error(err.error.status + ': ' + err.error.detail);  // Relanzo el error con el status y el detail
        }),
        map(response => {
          if (response.status_code === 200) { // Si el status del response es OK retorno contento como dato del observable
            return JSON.parse(response.content);
          } else {
            throw new Error( // Si no es OK el status del response, lanzo un error con el status y el text
              response.status_code + ': ' + response.text
            );
          }
        }),
        tap(content => { // Si se ejecuta el tap es porque no se lanzo antes ningun error, por lo tanto status===200(OK)
          userProfiles.push({
            id: content.id,
            phone_number: content.phone_number,
            comment: content.comment,
            summary: content.summary,
            user_id: content.user_id,
            scholarship_id: content.scholarship_id,
            user_profile_type: content.user_profile_type
          });
          localStorage.setItem('userProfiles', JSON.stringify(content));
        })
      );
    }
  }

  public get serviceProvider() {
    const profiles: Array<any> = JSON.parse(localStorage.getItem('userProfiles'));
    return profiles.find(elem => elem.id_user_profile_type_fk.type === 'SERVICE_PROVIDER');
  }

  public get client() {
    const profiles: Array<UserProfile> = JSON.parse(localStorage.getItem('userProfiles'));
    return profiles.find(elem => elem.id_user_profile_type_fk.type === 'CLIENT');
  }



  getAll() {}

  create(data: any): Observable<any> {
    let userProfiles: Array<any>;
    userProfiles = JSON.parse(localStorage.getItem('userProfiles')) || []; // Leo los profiles del localstorage.
    if (userProfiles) {
      if (userProfiles.length >= 2 ) { // Si hay 2 perfiles no se puede crear ningun otro. Se lanza un error.
        throw of (new Error('403: Forbidden. You can not have more than two profiles.'));
        // Si solo hay un perfil, pero es del tipo del que se quiere crear
        // tampoco se puede crear. Se lanza un error
      } else if (userProfiles.length === 1) {
        if (userProfiles[0].user_profile_type === data.user_profile_type) {
          throw new Error('403: Forbidden. You already have a profile of that type.');
        }
      }
    }
    console.log(data);
    return this.http.post<any>(this.apiPath + '/user_profile', data).pipe(
      catchError(err => { // Captura si hubo algun error en la llamada y lo relanza
        throw new Error(err.error.status + ': ' + err.error.detail);  // Relanzo el error con el status y el detail
      }),
      map(response => {
        console.log(response);
        if (response.status_code === 200) { // Si el status del response es OK retorno contento como dato del observable
          return JSON.parse(JSON.parse(response.content));
        } else {
          throw new Error( // Si no es OK el status del response, lanzo un error con el status y el text
            response.status_code + ': ' + (JSON.parse(response.content)).text
          );
        }
      }),
      tap(content => { // Si se ejecuta el tap es porque no se lanzo antes ningun error, por lo tanto status===200(OK)
        console.log('content', content);
        const uP = { // Se agrega un nuevo userProfile al arreglo con data.
          id: content.id,
          valoration: content.valoration,
          phone_number: content.phone_number,
          comment: data.comment,
          summary: data.summary,
          user_id: data.user_id,
          user_profile_account: data.user_profile_account,
          name: data.name,
          scholarship_id: data.scholarship_id,
          user_profile_type: data.user_profile_type
        };
        userProfiles.push(content);
        console.log('userProfiles', userProfiles);
        localStorage.setItem('userProfiles', JSON.stringify(userProfiles)); // Se guarda el arreglo de userProfiles en el localStorage
        if (data.user_profile_briefcase !== null) {
          localStorage.setItem('briefcases', JSON.stringify(content.briefcases));
        }
      })
    );
  }

  edit(data: any) {
    return this.http.put<any>(this.apiPath + '/user_profile', data)
      .pipe(
        catchError(err => { // Captura si hubo algun error en la llamada y lo relanza
          throw  new Error(err.error.status + ': ' + err.error.detail);  // Relanzo el error con el status y el detail
        }),
        map(response => {
          const content = JSON.parse(response.content); // Seleccionar la parte del response q es el contenido
          if (response.status_code === 200) {
            return content; // Retorno el content del response como cuerpo del observable
          } else { // Si no fue OK el status del response lanzo un error con el status code y el text del response.
            throw new Error(
              response.status_code + ': ' + response.text
            );
          }
        }),
        tap(content => {
          let profiles = JSON.parse(localStorage.getItem('userProfiles')) || []; // Leo los profiles del localStorage
          profiles.forEach(pf => { // Con el foreach recorro los profiles para modificar el que corresponda con el id q estoy modificando
            if (pf.id === data.id) {
              pf = { // Modifico campo por campo del profile con los datos del request
                phone_number: data.phone_number,
                comment: data.comment,
                summary: data.summary,
                user_id: data.user_id,
                scholarship_id: data.scholarship_id,
                user_profile_type: data.user_profile_type
              };
            }
          });
          // Una vez modificados los campos salvo el array completo de userProfiles
          localStorage.setItem('userProfiles', JSON.stringify(profiles));
        }
        ));
  }

  delete(id: string): Observable<any> {
    const req = {
      id: id,
      client_secret: environment.clientSecret,
      client_id: environment.clientId
    };
    return this.http.request<any>('DELETE', this.apiPath + '/user_profile', { body: req }).pipe(
      catchError(err => { // Captura si hubo algun error en la llamada y lo relanza
        throw new Error(err.error.status + ': ' + err.error.detail);  // Relanzo el error con el status y el detail
      }),
      map(response => {
        if (response.status_code === 200) { // Si el status del response es OK retorno contento como dato del observable
          return JSON.parse(response.content);
        } else {
          throw new Error( // Si no es OK el status del response, lanzo un error con el status y el text
            response.status_code + ': ' + response.text
          );
        }
      }),
      tap(content => { // Si se ejecuta el tap es porque no se lanzo antes ningun error, por lo tanto status===200(OK)
        let userProfiles: Array<any> = JSON.parse(localStorage.getItem('userProfiles')) || []; // Leo el array del storage para actualizarlo

        userProfiles.splice(userProfiles.findIndex(elem => elem.id === id), 1); // Cuando encuentro el id, elimino el elemento

        console.log('profiles after delete', userProfiles);
        localStorage.setItem('userProfiles', JSON.stringify(userProfiles));
      })
    );
  }



}
