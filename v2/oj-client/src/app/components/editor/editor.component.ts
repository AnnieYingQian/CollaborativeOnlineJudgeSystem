import { Component, OnInit } from '@angular/core';
import { CollaborationService } from '../../services/collaboration.service'
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params } from '@angular/router';
import { DataService } from '../../services/data.service';

declare var ace: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  public languages: string[] = ['Java', 'Python', 'C++'];
  language: string = 'Java';
  sessionId: string;
  output: string = '';
  editor: any;

  users: string = '';
  subscriptionUsers: Subscription;

  defaultContent = {
    'Java': `public class Example {
      public static void main(String[] args) {
        // Type your Java code here
      }
    }`,
    'Python': `class solution:
      def example():
        # Write your Python code here`
    ,
    'C++': `int main() 
    {
        return 0;
    }
    `
  }

  constructor(private collaboration: CollaborationService,
    private route: ActivatedRoute,
    private dataService: DataService) { }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.sessionId = params['id'];
        this.initEditor();
      });
    
    this.collaboration.restoreBuffer();
  }

  initEditor(): void {
    this.editor = ace.edit("editor");
    this.editor.setTheme("ace/theme/eclipse");

    this.resetEditor();
    
    document.getElementsByTagName('textarea')[0].focus();
    // setup collaboration socket
    this.subscriptionUsers = this.collaboration.init(this.editor, this.sessionId)
      .subscribe(users => this.users = users);
    
    this.editor.lastAppliedChange = null;

    this.editor.on("change", (e) => {
      console.log('editor changes: ' + JSON.stringify(e));
      //check if the change is same as last change
      // if they are the same, skip this change
      if (this.editor.lastAppliedChange != e) {
        this.collaboration.change(JSON.stringify(e));
      }
    })
  }

  resetEditor(): void {
    this.editor.setValue(this.defaultContent[this.language]);
    this.editor.getSession().setMode("ace/mode/" + this.language.toLowerCase());
  }

  setLanguage(language: string): void {
    this.language = language;
    this.resetEditor();
  }

  submit(): void {
    let code = this.editor.getValue();
    console.log(code);

    const data = {
      code: code,
      lang: this.language.toLowerCase()
    };

    this.dataService.buildAndRun(data)
      .then(res => {
        this.output = res;
        console.log(this.output)});
  }

}
