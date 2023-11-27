import { Component, Input } from '@angular/core';
import { ErrorMessage } from './error-message.model';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
})
export class ErrorMessageComponent {
  @Input() message?: ErrorMessage

  constructor() {}
}
