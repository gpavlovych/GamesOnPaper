import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { Router, NavigationStart } from "@angular/router";
import {Alert} from "./alert";

@Injectable()
export class AlertService {
  private subject = new Subject<any>();
  private keepAfterNavigationChange = false;

  constructor(private router: Router) {
    // clear alert message on route change
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          // only keep for a single location change
          this.keepAfterNavigationChange = false;
        } else {
          // clear alert
          this.subject.next();
        }
      }
    });
  }

  private sendMessage(message: Alert) {
    this.subject.next(message);
  }

  public success(text: string, keepAfterNavigationChange: boolean = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.sendMessage({text: text, type: "success", link: null});
  }

  public error(text: string){
    this.sendMessage({text: text, type: "error", link: null})
  }

  public successWithLink(text: string, linkHref: string, linkText: string){
    this.sendMessage({text: text, type: "success", link: {href: linkHref, text: linkText}});
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
