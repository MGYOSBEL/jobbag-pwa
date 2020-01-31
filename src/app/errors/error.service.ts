import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private _errorMessage: JSON;

  get errorMessage(): JSON {
    return (this._errorMessage);
  }
  set errorMessage(message: JSON) {
    this._errorMessage = message;
  }

  constructor() { }
}
