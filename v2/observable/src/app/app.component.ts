import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';

  ngOnInit() {
    // let stream$ = new Observable(observer => {
    //   console.log('observable start');

    //   observer.next(1);
    //   observer.next(2);
    //   // observer.error(new Error('no more'));

    //   observer.next(3);
    //   // do something
    //   observer.complete();

    // });

    // let subscription =stream$.subscribe(
    //   value => console.log(value),
    //   error => console.log(error),
    //   () => console.log('done')
    // );

    // let subscription2 =stream$.subscribe(
    //   value => console.log(value),
    //   error => console.log(error),
    //   () => console.log('done')
    // );

    let subject = new Subject();

    subject.subscribe( v => console.log('subject 1' + v));

    subject.subscribe( v => console.log('subject 2' + v));

    subject.next(1);
    subject.next(2);

    subject.subscribe( v => console.log('subject 3' + v));

    subject.next(3);
  }
}
