import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Injectable()
export class MessagesService {

  private errorSubject = new BehaviorSubject<string[]>([]);
  private messagesSubject = new BehaviorSubject<string[]>([]);

  errors$: Observable<string[]>  = this.errorSubject.asObservable().pipe(
    filter(messages => messages && messages.length > 0)
  );
  messages$: Observable<string[]>  = this.messagesSubject.asObservable().pipe(
    filter(messages => messages && messages.length > 0)
  );

  constructor() { }

  showErrors(...errors: string[]) {
    this.errorSubject.next(errors);
  }

  showMessages(...messages: string[]) {
    this.errorSubject.next(messages);
  }
}
