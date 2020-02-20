import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfessionService {
  apiPath = environment.apiBaseURL;

  constructor(private http: HttpClient) { }

  get() {}

  getAll() {
    return this.http.get<any>(this.apiPath + '/profession/all/en').pipe(
      map(data => JSON.parse(JSON.parse(data.content)))
    );

  }

  create() {}

  edit() {}

  delete() {}
}
