import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BriefcaseService {

  apiPath = environment.apiBaseURL;

  constructor(private http: HttpClient) { }

  get() {}

  getAll() {}

  create(data: any) {
    return this.http.post<any>(this.apiPath + '/briefcase', data).pipe(
      map(response => JSON.parse(JSON.parse(response.content))),
      tap(response => console.log('CREATE-BRIEFCASE-RESPONSE: ' + JSON.stringify(response)))
    );
  }

  edit() {}

  delete() {}
}
