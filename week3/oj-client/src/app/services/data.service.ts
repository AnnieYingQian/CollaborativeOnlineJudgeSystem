import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { Problem } from '../models/problem.model';


@Injectable()
export class DataService {
  // lost of problems
  // problems: Problem[] = PROBLEMS;
  private _problemSource = new BehaviorSubject<Problem[]>([]);


  constructor(private httpClient: HttpClient) { }

  // return a list of problems
  getPorblems(): Observable<Problem[]> {
    this.httpClient.get('api/v1/problems')
      .toPromise()
      .then((res: any) => {
        //.next next data
        this._problemSource.next(res);
      })
      .catch(this.handleError);

      return this._problemSource.asObservable();
  } 

  // input: id 
  // return a problem by id
  getProblem(id: number): Promise<Problem> {
    //return this.problems.find((problem) => problem.id === id);
    return this.httpClient.get(`api/v1/problems/${id}`)
      .toPromise()
      .then((res: any) => res)
      .catch(this.handleError);
  }

  addProblem(problem: Problem) {
    // problem.id = this.problems.length + 1;
    // this.problems.push(problem);
    const options = { headers: new HttpHeaders( { 'Content-Type': 
      'application/json' } ) };
    return this.httpClient.post('api/v1/problems', problem, options)
      .toPromise()
      .then((res: any) => {
        this.getPorblems();
        return res;
      })
      .catch(this.handleError);
  }

  buildAndRun(data) : Promise<any> {
    // define the Content-Type in http request header
    // Content-Type declares the body type when you issue a POST request
    const options = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.httpClient.post('api/v1/build_and_run', data, options)
      .toPromise() // convert observable to promise
      .then(res => {
        console.log(res);
        return res;
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('an error occured', error)
    return Promise.reject(error.body || error);
  }
 
}

