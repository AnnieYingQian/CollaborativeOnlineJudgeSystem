import { Component, OnInit } from '@angular/core';
// import { setTimeout } from 'timers';
import { Observable, Subject } from 'rxjs/Rx';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  ngOnInit() {
    // callback:
    // console.log('setTimeout start exec');

    // setTimeout( () => {
    //   console.log('promise resolved');
    // }, 5000);

    // console.log('setTimeout end exec');

    // promise:
    // let promise = new Promise ( (resolve, reject) => {
    //   console.log('promise exec');
    //   let x = 10;

    //   setTimeout( () => {
    //     if (x > 5 && x <10) {
    //       resolve('promise resolved');
    //     } else if (x >= 10) {
    //       resolve('it\'s great')
    //     } else {
    //       reject(new Error('promise rejected'));
    //     }
    //    }, 3000);
    // });

    // promise.then( (value: string) => {
    //   console.log(value);
    // });

    // observable:
    // let stream$ = new Observable(observer => {
    //   console.log('observable exec');

    //   observer.next(1);
    //   observer.next(2);

    //   //observer.error(new Error('not any more'));
    //   //observer.complete();
    //   setTimeout(() => {observer.next(3);}, 3000);
    // });

    // let subscription1 = stream$.subscribe(
    //   value => console.log(value),
    //   error => console.error(error),
    //   () => console.log('done')
    // )

    // let subscription2 = stream$.subscribe(
    //   value => console.log(value),
    //   error => console.error(error),
    //   () => console.log('done')
    // )

    // subject:
    let subject = new Subject();
    
    subject.subscribe((v) => console.log('ObserverA: ' + v));
    subject.subscribe((v) => console.log('ObserverB: ' + v));

    subject.next(1);
    subject.next(2);

    subject.subscribe((v) => console.log('ObserverC: ' + v));
    subject.next(3);
  }
}
