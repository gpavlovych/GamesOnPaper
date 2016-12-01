import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {ModalDirective} from "ng2-bootstrap";
import {ConfirmationService} from "../confirmation.service";

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  private resolve: (boolean) => any;
  private title: string;
  private message: string;

  constructor(private confirmationService: ConfirmationService) {
    confirmationService.confirm = this.confirm.bind(this);
  }

  @ViewChild('childModal') public childModal:ModalDirective;

  private show(resolve:(boolean) => any):void {
    this.resolve = resolve;
    this.childModal.show();
  }

  hide(canceled: boolean):void {
    this.resolve(canceled);
    this.childModal.hide();
  }

  confirm(message?: string, title?: string) {
    this.message = message;
    this.title = title;
    let promise = new Promise<boolean>(resolve => {
      this.show(resolve);
    });
    return promise;
  }

  ngOnInit() {
  }
}
