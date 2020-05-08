import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { APIResponse } from '@app/models/app.model';
import { environment } from '@environments/environment';
import { map, catchError, tap } from 'rxjs/operators';
import { Service } from '../models/services.model';
import { LoggingService } from '@app/services/logging.service';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(
    private logger: LoggingService,
    private http: HttpClient
  ) { }

  getAll(): Observable<Service[]> {
    return this.http.get<APIResponse>(`${environment.apiBaseURL}/service`).pipe(
      map((response: APIResponse) => {
        if (response.status_code === 200) {
          return JSON.parse(JSON.parse(response.content));
        } else {
          return throwError(response.status_code + response.content.text);
        }
      }),
      catchError(err => throwError(err)),
      tap(res => this.logger.log(res))
    );
  }
}
