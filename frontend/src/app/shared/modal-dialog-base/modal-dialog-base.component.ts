import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';

export interface ModalFooterButton {
  label: string;
  onClick: () => void;
}

/**
 * Apply the 'ion-page' class to the tag when using this component so the Ionic styling is applied.
 * Serves as a base for all other modal filter dialogs. Contains a header with a conditional clear button and a footer with Cancel and Apply buttons.
 */
@Component({
  selector: 'app-modal-dialog-base',
  templateUrl: './modal-dialog-base.component.html',
  styleUrls: ['./modal-dialog-base.component.scss'],
})
export class ModalDialogBaseComponent {
  @Input() header?: string;
  @Input() headerIcon?: string;
  @Input() headerColor: 'primary' | 'dark' = 'dark';

  @Input() showButton?: 'all' | 'clear';
  @Input() clearButtonTitle?: string;
  @Input() allButtonTitle?: string;
  @Input() applyButtonTitle = 'Apply';
  @Input() applyDisabled = false;

  // overwrites default footer buttons. Last in the array is filled
  @Input() customFooterButtons?: ModalFooterButton[];

  @Output() clear: EventEmitter<void> = new EventEmitter<void>();
  @Output() all: EventEmitter<void> = new EventEmitter<void>();
  @Output() apply: EventEmitter<void> = new EventEmitter<void>();

  constructor(private modalController: ModalController) {}

  async closeModal(): Promise<void> {
    await this.modalController.dismiss(undefined, 'cancel');
  }
}
