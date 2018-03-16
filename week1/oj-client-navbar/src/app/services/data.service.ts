import { Injectable } from '@angular/core';
import { Problem } from '../models/problem.model';
import { PROBLEMS } from '../mock-problems';

@Injectable()
export class DataService {
  // lost of problems
  problems: Problem[] = PROBLEMS;


  constructor() { }

  // return a list of problems
  getPorblems(): Problem[] {
    return this.problems;
  } 

  // input: id 
  // return a problem by id
  getProblem(id: number): Problem {
    return this.problems.find((problem) => problem.id === id);
  }

  addProblem(problem: Problem) {
    problem.id = this.problems.length + 1;
    this.problems.push(problem);
  }
 
}

