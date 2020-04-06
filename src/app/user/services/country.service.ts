import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { APIResponse } from '@app/models/app.model';
import { Country } from '../models/country.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(
    private http: HttpClient
  ) { }

  get(): Observable<Country> {
    return this.http.get<APIResponse>(`${environment.apiBaseURL}/country`).pipe(
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
      tap(
        content => console.log(content)
      )
    );
}
}
