import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '@app/models/app.model';
import { environment } from '@environments/environment';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(
    private http: HttpClient,
  ) { }

    editProfilePicture(userProfileId: number, picture: string): Observable<boolean> {
      const request = {
        client_id: environment.clientId,
        client_secret: environment.clientSecret,
        user_profile_id: userProfileId,
        picture
      };
      return this.http.put<APIResponse>(`${environment.apiBaseURL}/media/userProfilePicture`, request).pipe(
        catchError(err => {
          throw  new Error(err.error.status + ': ' + err.error.detail);  // Relanzo el error con el status y el detail
        }),
        map( response => {
          const content = JSON.parse(response.content); // Seleccionar la parte del response q es el contenido
          if (response.status_code === 200) {
            return JSON.parse(content) ; // Retorno el content del response como cuerpo del observable
          } else { // Si no fue OK el status del response lanzo un error con el status code y el text del response.
            throw new Error(
              response.status_code + ': ' + response.content
            );
          }
        }),
        tap(url => {
          // this.activeProfile.activeProfile.picture = url; // Esto no la agrega al profile del localStorage
        })
      );
    }

    editProfileCV(userProfileId: number, cv: string): Observable<boolean> {
      const request = {
        client_id: environment.clientId,
        client_secret: environment.clientSecret,
        user_profile_id: userProfileId,
        cv
      };
      console.log(`${environment.apiBaseURL}/media/userProfileCV`, request);
      return this.http.put<APIResponse>(`${environment.apiBaseURL}/media/userProfileCV`, request).pipe(
        catchError(err => {
          throw  new Error(err.error.status + ': ' + err.error.detail);  // Relanzo el error con el status y el detail
        }),
        map( response => {
          const content = JSON.parse(response.content); // Seleccionar la parte del response q es el contenido
          if (response.status_code === 200) {
            return JSON.parse(content); // Retorno el content del response como cuerpo del observable
          } else { // Si no fue OK el status del response lanzo un error con el status code y el text del response.
            throw new Error(
              response.status_code + ': ' + response.content
            );
          }
        }),
        tap(url => {
          // this.activeProfile.activeProfile.picture = url; // Esto no la agrega al profile del localStorage
        })
      );
    }

    deleteProfilePicture(userProfileId: number, picture: string): Observable<boolean> {
      const request = {
        client_id: environment.clientId,
        client_secret: environment.clientSecret,
        user_profile_id: userProfileId,
        picture
      };
      return this.http.request<APIResponse>('DELETE', `${environment.apiBaseURL}/media/userProfilePicture`, { body: request}).pipe(
        catchError(err => {
          throw  new Error(err.error.status + ': ' + err.error.detail);  // Relanzo el error con el status y el detail
        }),
        map( response => {
          const content = JSON.parse(response.content); // Seleccionar la parte del response q es el contenido
          if (response.status_code === 200) {
            return content === 'OK'; // Retorno el content del response como cuerpo del observable
          } else { // Si no fue OK el status del response lanzo un error con el status code y el text del response.
            throw new Error(
              response.status_code + ': ' + response.content
            );
          }
        }),
        tap() // Debo actualizar el profile, pues la url del profilePicture cambia
      );
    }

    deleteProfileCV(userProfileId: number, cv: string): Observable<boolean> {
      const request = {
        client_id: environment.clientId,
        client_secret: environment.clientSecret,
        user_profile_id: userProfileId,
        cv
      };
      return this.http.request<APIResponse>('DELETE', `${environment.apiBaseURL}/media/userProfileCV`, { body: request}).pipe(
        catchError(err => {
          throw  new Error(err.error.status + ': ' + err.error.detail);  // Relanzo el error con el status y el detail
        }),
        map( response => {
          const content = JSON.parse(response.content); // Seleccionar la parte del response q es el contenido
          if (response.status_code === 200) {
            return content === 'OK'; // Retorno el content del response como cuerpo del observable
          } else { // Si no fue OK el status del response lanzo un error con el status code y el text del response.
            throw new Error(
              response.status_code + ': ' + response.content
            );
          }
        }),
        tap() // Debo actualizar el profile, pues la url del profileCV cambia
      );
    }


}
