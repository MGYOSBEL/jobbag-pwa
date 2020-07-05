import { Component, OnInit } from '@angular/core';
import { Observable, interval, timer } from 'rxjs';
// import {Message} from '../model/message';
import { tap, take } from 'rxjs/operators';
import { MessagesService } from '@app/services/messages.service';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  showErrors = false;
  showMessages = false;

  errors$: Observable<string[]>;
  messages$: Observable<string[]>;

  errortimer$;
  messagetimer$;
  constructor(private messagesService: MessagesService) {
    this.errortimer$ = interval(15000).pipe(
      take(1),
      tap(() => {
        this.showErrors = false;
      })
    );
    this.messagetimer$ = interval(15000).pipe(
      take(1),
      tap(() => {
        this.showMessages = false;
      })
    );
  }

  ngOnInit() {
    this.errors$ = this.messagesService.errors$
      .pipe(
        tap(() => {
          this.showErrors = true;
          this.errortimer$.subscribe();
        })

      );
    this.messages$ = this.messagesService.messages$
      .pipe(
        tap((messages) => {
          this.showMessages = true;
          this.messagetimer$.subscribe();
        })

      );
  }


  onErrorClose() {
    this.showErrors = false;
  }
  onMessageClose() {
    this.showMessages = false;
  }

}
