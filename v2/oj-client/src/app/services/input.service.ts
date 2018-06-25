import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InputService {
  private inputSubjects$ = new BehaviorSubject<string>('');

  constructor() { }

  changeInput(term) {
    this.inputSubjects$.next(term);
  }

  getInput(): Observable<string> {
    return this.inputSubjects$.asObservable();
  }
}
