import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Problem } from '../../models/problem.model';
import { DataService } from '../../services/data.service';
import { InputService } from '../../services/input.service';

@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {
  // private problems list inside the component
  problems: Problem[];
  subscriptionProblems: Subscription;

  searchTerm: string = '';
  subscriptionInput: Subscription;

  constructor(private dataService: DataService,
              private inputService: InputService) { }

  ngOnInit() {
    // init problem list
    this.getProblems();
    this.getSearchTerm();
  }

  ngOnDestroy() {
    this.subscriptionProblems.unsubscribe();
  }

  getProblems() {
    //this.problems = this.dataService.getPorblems();
    this.subscriptionProblems = this.dataService.getPorblems()
      .subscribe(problems => this.problems = problems);
  }

  getSearchTerm(): void {
    this.subscriptionInput = this.inputService.getInput()
                                .subscribe(
                                  inputTerm => this.searchTerm = inputTerm
                                );
  }

}
