import { Component, OnInit } from '@angular/core';
import {Observable, interval, timer} from 'rxjs';
// import {Message} from '../model/message';
import {tap, take} from 'rxjs/operators';
import { MessagesService } from '@app/services/messages.service';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  showMessages = false;

  errors$: Observable<string[]>;
  timer$;
  constructor(private messagesService: MessagesService) {
    this.timer$ = interval(15000).pipe(
      take(1),
      tap(() => this.showMessages = false)
    );
  }

  ngOnInit() {
    this.errors$ = this.messagesService.errors$
    .pipe(
      tap(() => {
        this.showMessages = true;
        this.timer$.subscribe();
      }),

    );
  }


  onClose() {
    this.showMessages = false;

  }

}
