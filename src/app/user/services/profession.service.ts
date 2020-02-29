import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfessionService {
  apiPath = environment.apiBaseURL;

  constructor(private http: HttpClient) { }

  get(id: string): string {
    const professions = JSON.parse(localStorage.getItem('professions')) || [];
    for (const iterator of professions) {
      if (iterator.id === id) {
        return iterator.description_en;
      }
    }
    return null;
  }
  getAll(forceRequest?: boolean): Observable<any> {
    const professions = localStorage.getItem('professions');
    if (professions !== null && !forceRequest) { // Si hay valor en el storage no hay que hacer el request
      return of (JSON.parse(professions));
    } else {
      // Consulta a la API para obtener todas las profesiones
      return this.http.get<any>(this.apiPath + '/profession/all/en').pipe(
        catchError(err => { // Captura si hubo algun error en la llamada y lo relanza
          throw (err.error.status + err.error.detail);
          }),
        map(response => {
          if (response.status_code === 200) { // Si el status es OK devuelve response.content
            return JSON.parse(JSON.parse(response.content));
          }
          throw ('status_code = ' + response.status_code + '. ' + response.message); // Si no es OK lanza un error
        }),
        tap(content => localStorage.setItem('professions', JSON.stringify(content)))
      );
    }

  }

  create() {}

  edit() {}

  delete() {}
}
