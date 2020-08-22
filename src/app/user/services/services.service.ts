import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { APIResponse } from '@app/models/app.model';
import { environment } from '@environments/environment';
import { map, catchError, tap, filter, switchMapTo } from 'rxjs/operators';
import { Service } from '../models/services.model';
import { LoggingService } from '@app/services/logging.service';
import { AuthenticationService } from '@app/auth/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private subject = new BehaviorSubject<Service[]>([]);
  services$ = this.subject.asObservable();

  constructor(
    private authenticationService: AuthenticationService,
    private http: HttpClient
  ) {

    authenticationService.isLoggedIn$.pipe(
      filter(loggedin => loggedin === true),
      switchMapTo(this.getAll())
    ).subscribe(
      services => this.subject.next(services)
    );

    // this.getAll().subscribe(
    //   services => this.subject.next(services)
    // );
   }

  getAll(): Observable<Service[]> {
    return this.http.get<APIResponse>(`${environment.apiBaseURL}/service`).pipe(
      map((response: APIResponse) => {
        if (response.status_code === 200) {
          return JSON.parse(JSON.parse(response.content));
        } else {
          return throwError(response.status_code + response.content.text);
        }
      }),
      catchError(err => throwError(err))
    );
  }
}
