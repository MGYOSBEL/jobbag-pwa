import { APIResponse } from './app.model';
import { throwError } from 'rxjs';

export function APIResponseToData(response: APIResponse): any {

  if (response.status_code === 200) {
    return JSON.parse(JSON.parse(response.content));
  } else {
    return throwError(response.status_code + response.content.text);
  }

}
