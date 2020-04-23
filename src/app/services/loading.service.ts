import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, concatMap, finalize } from 'rxjs/operators';

@Injectable()
export class LoadingService {

  private loadingSubject = new BehaviorSubject(false);

  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() { }

  showLoaderUntilCompletes<T>(obs$: Observable<T>): Observable<T> {

   return of(null)
    .pipe(
      tap(() => this.loadingOn()),
      concatMap(() => obs$),
      finalize(() => this.loadingOff())
    );
  }

  loadingOn() {
    this.loadingSubject.next(true);
  }

  loadingOff() {
    this.loadingSubject.next(false);
  }
}
