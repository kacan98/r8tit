import { Component, OnInit } from '@angular/core';
import { ModalFooterButton } from '../../../shared/modal-dialog-base/modal-dialog-base.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  buttons: ModalFooterButton[] = [
    {
      label: 'Close',
      onClick: () => this.modalController.dismiss(),
    },
  ];

  constructor(private modalController: ModalController) {}

  ngOnInit() {}
}
