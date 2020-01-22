import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  private counter: number;

  constructor() {
    this.counter = 0;
  }

  log(text: string) {
    console.log(this.counter++, text);

  }
}
