import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Injectable()
export class MessagesService {

  private subject = new BehaviorSubject<string[]>([]);

  errors$: Observable<string[]>  = this.subject.asObservable().pipe(
    filter(messages => messages && messages.length > 0)
  );

  constructor() { }

  showErrors(...errors: string[]) {
    this.subject.next(errors);
  }
}
