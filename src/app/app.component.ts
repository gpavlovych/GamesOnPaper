import { Component, ViewContainerRef } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public constructor(componentsHelper:ComponentsHelper, vcr:ViewContainerRef) {
    componentsHelper.setRootViewContainerRef(vcr);
  }
  gamesToBeCreated=[];
  incomingInvitations=[];
  outgoingInvitations=[];
  activeGames=[];
  finishedGames=[];
  top100Players=[];
  title = 'app works!';
}
