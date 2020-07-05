import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { catchError, map, tap, retry, count } from 'rxjs/operators';
import { APIResponse } from '@app/models/app.model';
import { Country } from '../models/country.model';
import { Observable, throwError, of, BehaviorSubject } from 'rxjs';
import { LoggingService } from '@app/services/logging.service';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private subject = new BehaviorSubject<Country[]>([]);
  countries$ = this.subject.asObservable();

  constructor(
    private logger: LoggingService,
    private http: HttpClient
  ) {
    this.get().subscribe(
      countries => this.subject.next(countries)
    );
  }

  get(): Observable<Country[]> {
    const countries: Country[] = JSON.parse(localStorage.getItem('countries'));
    if (countries && countries.length > 0) {
      this.logger.log('countries fetched from cache.');
      return of (countries);
    }
    return this.http.get<APIResponse>(`${environment.apiBaseURL}/country`).pipe(
      map( response => {
        const content = JSON.parse(response.content); // Seleccionar la parte del response q es el contenido
        if (response.status_code === 200) {
          return JSON.parse(content) ; // Retorno el content del response como cuerpo del observable
        } else { // Si no fue OK el status del response lanzo un error con el status code y el text del response.
          return throwError(
            response.status_code + ': ' + response.content
          );
        }
      }),
      retry(3),
      catchError(err => {
        return throwError(err.error.status + ': ' + err.error.detail);  // Relanzo el error con el status y el detail
      }),
      tap(
        (content: Country[]) => {
          localStorage.setItem('countries', JSON.stringify(content));
          this.logger.log('fetched countries from api', content);
        }
      )
    );
}
}
