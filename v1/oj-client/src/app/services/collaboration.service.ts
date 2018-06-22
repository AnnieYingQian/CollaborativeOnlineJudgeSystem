import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

declare var io: any;

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {
  collaborationSocket: any;
  private _userSource = new Subject<string>();

  constructor() { }

  init(editor: any, sessionId: string): Observable<string> {

    this.collaborationSocket = io(window.location.origin, 
        { query: 'sessionId=' + sessionId});

    this.collaborationSocket.on("message", (message) => {
      console.log('message revived from server: ' + message);
    });

    this.collaborationSocket.on("change", (delta: string) => {
      console.log('collaboration: editor changed by ' + delta);
      delta = JSON.parse(delta);
      editor.lastAppliedChange = delta;
      editor.getSession().getDocument().applyDeltas([delta]);
    });

    this.collaborationSocket.on("message", (data: string[]) => {
      console.log('collaboration: user changes ' + data);

      this._userSource.next(data.toString());
    });

    return this._userSource.asObservable();

  }

  change(delta: string): void {
    this.collaborationSocket.emit("change", delta);
  }

  restoreBuffer(): void {
    this.collaborationSocket.emit("restoreBuffer");
  }
}
