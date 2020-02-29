import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScholarshipService {

  apiPath = environment.apiBaseURL;

  constructor(private http: HttpClient) { }

  get(id: string): string {
    const scholarships = JSON.parse(localStorage.getItem('scholarships')) || [];
    for (const iterator of scholarships) {
      if (iterator.id === id) {
        return iterator.description_en;
      }
    }
    return null;
  }

  getAll(forceRequest?: boolean): Observable<any> {
    const scholarships = localStorage.getItem('scholarships');
    if (scholarships !== null && !forceRequest) { // Si hay valor en el storage no hay que hacer el request
      return of (JSON.parse(scholarships));
    } else {
      // Consulta a la API para obtener todas las scholarships
      return this.http.get<any>(this.apiPath + '/scholarship/all').pipe(
        catchError(err => { // Captura si hubo algun error en la llamada y lo relanza
          throw (err.error.status + err.error.detail);
          }),
        map(response => {
          if (response.status_code === 200) { // Si el status es OK devuelve response.content
            return JSON.parse(JSON.parse(response.content));
          }
          throw ('status_code = ' + response.status_code + '. ' + response.message); // Si no es OK lanza un error
        }),
        tap(content => localStorage.setItem('scholarships', JSON.stringify(content)))
      );
    }
  }

  create() {}

  edit() {}

  delete() {}
}
