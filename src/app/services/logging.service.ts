import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  private counter: number;

  constructor() {
    this.counter = 0;
  }

  log(...params) {
    if (environment.allowLogs) {
      console.log(this.counter++, params);
    }
  }
}
