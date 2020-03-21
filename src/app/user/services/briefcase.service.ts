import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BriefcaseService {

  apiPath = environment.apiBaseURL;
  briefcases: Array<any>;

  constructor(private http: HttpClient) {
    this.briefcases = [];

  }

  get(id: string) {
    const briefcases: Array<any> = JSON.parse(localStorage.getItem('briefcases')) || []; // Leo el array de userProfiles del storage
    if (briefcases) {
      for (const iterator of briefcases) {
        if (iterator.id === id) { // Recorro el array y si esta el perfil que busco lo retorno como un observable
          return of(iterator);
        }
      }
    }
    return this.http.get<any>(this.apiPath + '/briefcase/' + id).pipe(
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
        briefcases.push({
          id: content.id,
          comments: content.comments,
          description: content.description,
          start_date: content.start_date,
          end_date: content.end_date,
          id_profession: content.id_profession
        });
        localStorage.setItem('briefcases', JSON.stringify(briefcases));

      })
    );

  }

  getAll(): Observable<any> {
    const briefcases: Array<any> = JSON.parse(localStorage.getItem('briefcases')) || []; // Leo el array de userProfiles del storage
    return of (briefcases);
  }

  create(userProfileId: number, briefcase: any): Observable<any> {
    const data = {
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      user_profile_id: userProfileId,
      briefcase
    };
    console.log('briefcase request: ', data);
    return this.http.post<any>(this.apiPath + '/briefcase', data).pipe(
      catchError(err => {
        throw new Error (err.error.status + ': ' + err.error.detail);
      }),
      map(response => {
        console.log('bc_create response: ', response);
        if (response.status_code === 200) { // Si el status del response es OK retorno contento como dato del observable
          return JSON.parse(JSON.parse(response.content));
        } else {
          throw new Error( // Si no es OK el status del response, lanzo un error con el status y el text
            response.status_code + ': ' + response.text
          );
        }
      }),
      tap(content => { // Salvo el contenido del nuevo briefcase en el localStorage
        console.log('content: ', content);
        let briefcases: Array<any> = JSON.parse(localStorage.getItem('briefcases')) || [];
        briefcases.push({ // Agrego un elemento
          comment: briefcase.comment,
          id: content.id,
          description: briefcase.description,
          start_date: briefcase.start_date,
          end_date: briefcase.end_date,
          id_profession: briefcase.id_profession
        });
        localStorage.setItem('briefcases', JSON.stringify(briefcases));
      })
    );
  }

  edit(userProfileId: number, briefcase: any): Observable<any> {
    const data = {
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      user_profile_id: userProfileId,
      briefcase
    };
    console.log(data);
    return this.http.put<any>(this.apiPath + '/briefcase', data).pipe(
      catchError(err => {
        throw new Error (err.error.status + ': ' + err.error.detail);
      }),
      map(response => {
        const content = JSON.parse(response.content); // Seleccionar la parte del response q es el contenido
        console.log('content: ', content);
        if (response.status_code === 200) {
          return content; // Retorno el content del response como cuerpo del observable
        } else { // Si no fue OK el status del response lanzo un error con el status code y el text del response.
          throw new Error(
            response.status_code + ': ' + response.text
          );
        }
      }),
      tap (content => {
        let briefcases: Array<any> = JSON.parse(localStorage.getItem('briefcases')) || []; // Leo los profiles del localStorage
        const index = briefcases.findIndex(elem => elem.id == briefcase.id);
        console.log('index', index);
        console.log('briefcases', briefcases);
        briefcases[index] = { // Modifico campo por campo del profile con los datos del request
          comments: briefcase.comments,
          id: briefcase.id,
          description: briefcase.description,
          start_date: briefcase.start_date,
          end_date: briefcase.end_date,
          id_profession: briefcase.id_profession
        };
        // Una vez modificados los campos salvo el array completo de userProfiles
        localStorage.setItem('briefcases', JSON.stringify(briefcases));
      }
      ));
}

delete(id: string): Observable<any> {
  const req = {
    briefcase: {
      id
    },
    client_secret: environment.clientSecret,
    client_id: environment.clientId
  };
  console.log(req);
  return this.http.request<any>('DELETE', this.apiPath + '/briefcase', { body: req }).pipe(
    catchError(err => { // Captura si hubo algun error en la llamada y lo relanza
      throw new Error(err.error.status + ': ' + err.error.detail);  // Relanzo el error con el status y el detail
    }),
    map(response => {
      console.log(response);
      if (response.status_code === 200) { // Si el status del response es OK retorno contento como dato del observable
        return JSON.parse(response.content);
      } else {
        throw new Error( // Si no es OK el status del response, lanzo un error con el status y el text
          response.status_code + ': ' + response.content.text
        );
      }
    }),
    tap(content => { // Si se ejecuta el tap es porque no se lanzo antes ningun error, por lo tanto status===200(OK)
      let briefcases : Array<any> = JSON.parse(localStorage.getItem('briefcases')) || []; // Leo el array del storage para actualizarlo
      briefcases.splice(briefcases.findIndex(elem => elem.id === id), 1); // Cuando encuentro el id, elimino el elemento
      localStorage.setItem('briefcases', JSON.stringify(briefcases));

    })
  );
}
}
