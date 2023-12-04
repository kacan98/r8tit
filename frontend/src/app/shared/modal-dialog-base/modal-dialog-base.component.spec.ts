import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';

import { ModalDialogBaseComponent } from './modal-dialog-base.component';
import { Component, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

@Component({
  template: ` <app-modal-dialog-base
    #modalDialogBaseComponent
    header="Test header"
    [showButton]="showButton"
    clearButtonTitle="Test clear button title"
    allButtonTitle="Test all button title"
    (clear)="onClear()"
    (all)="onAll()"
    (apply)="onApply()"
  ></app-modal-dialog-base>`,
})
class TestHostComponent {
  @ViewChild('modalDialogBaseComponent', { static: false })
  modalDialogBaseComponent!: ModalDialogBaseComponent;

  showButton?: 'all' | 'clear';

  onClear(): void {}

  onAll(): void {}

  onApply(): void {}
}

describe('ModalDialogBaseComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let modalSpy: SpyObj<ModalController>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent, ModalDialogBaseComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        {
          provide: ModalController,
          useValue: createSpyObj('ModalSpy', ['dismiss']),
        },
      ],
    }).compileComponents();

    modalSpy = TestBed.inject(ModalController) as SpyObj<ModalController>;

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('shows the correct information', () => {
    component.showButton = 'all';
    fixture.detectChanges();

    const headerText = fixture.debugElement.query(By.css('ion-title'))
      ?.nativeElement?.textContent;
    const allButton = fixture.debugElement.query(
      By.css('ion-chip'),
    ).nativeElement;

    expect(headerText.trim()).toEqual('Test header');

    expect(allButton).toBeTruthy();
    expect(allButton?.title).toEqual('Test all button title');
  });

  describe('emits events correctly', () => {
    it('for apply', () => {
      const clearSpy = spyOn(component, 'onClear');
      const allSpy = spyOn(component, 'onAll');
      const applySpy = spyOn(component, 'onApply');

      const applyButton = fixture.debugElement.query(
        By.css('#footer-buttons ion-button:last-of-type'),
      )?.nativeElement;

      applyButton?.click();

      expect(allSpy).not.toHaveBeenCalled();
      expect(clearSpy).not.toHaveBeenCalled();
      expect(applySpy).toHaveBeenCalled();
    });

    it('for all', () => {
      component.showButton = 'all';
      fixture.detectChanges();

      const clearSpy = spyOn(component, 'onClear');
      const allSpy = spyOn(component, 'onAll');
      const applySpy = spyOn(component, 'onApply');

      const allButton = fixture.debugElement.query(
        By.css('ion-chip'),
      ).nativeElement;

      allButton?.click();

      expect(allSpy).toHaveBeenCalled();
      expect(clearSpy).not.toHaveBeenCalled();
      expect(applySpy).not.toHaveBeenCalled();
    });

    it('for clear', () => {
      component.showButton = 'clear';
      fixture.detectChanges();

      const clearSpy = spyOn(component, 'onClear');
      const allSpy = spyOn(component, 'onAll');
      const applySpy = spyOn(component, 'onApply');

      const clearButton = fixture.debugElement.query(
        By.css('ion-chip'),
      ).nativeElement;

      clearButton?.click();

      expect(allSpy).not.toHaveBeenCalled();
      expect(clearSpy).toHaveBeenCalled();
      expect(applySpy).not.toHaveBeenCalled();
    });
  });

  it('closes the modal', (done) => {
    const cancelButton = fixture.debugElement.query(
      By.css('#footer-buttons ion-button:first-of-type'),
    )?.nativeElement;

    cancelButton?.click();

    expect(modalSpy.dismiss).toHaveBeenCalledWith(undefined, 'cancel');
    done();
  });
});
