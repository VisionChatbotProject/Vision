import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { clickElement } from 'src/testutils/utils';
import { ConfirmDirective } from './confirm.directive';


@Component({ template: '<button (confirm)="confirm()" (reject)="reject()"></button>' })
class DefaultHostComponent { 
  public confirm(): void {};
  public reject(): void {};
}

@Component({ template: '<button (confirm)="confirm()" (reject)="reject()" [confirmTitle]="title" [confirmDescription]="text"></button>' })
class CustomHostComponent { 
  public title: string = "someTitle";
  public text: string = "someText";
  public confirm(): void {};
  public reject(): void {};
}

export class NgbConfirmModalRefMock {
  componentInstance = {
    title : '',
    text : ''
  };
  result: Promise<any> = new Promise((resolve, reject) => resolve(true));
}
 
describe('ConfirmDirective', () => {
  
  describe('with default texts', () => {
    let fixture: ComponentFixture<DefaultHostComponent>;
    let component: DefaultHostComponent;
    
    let modalService: NgbModal;
    let modalMock: NgbModalRef = new NgbConfirmModalRefMock() as NgbModalRef;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ConfirmDirective, DefaultHostComponent],
        providers: [
          { provide: NgbModal },
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(DefaultHostComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      modalService = TestBed.inject(NgbModal);      
    });

    it('should open a modal if attached element is clicked', () => {
      const modalOpenSpy = spyOn(modalService, 'open').and.callThrough();
      clickElement(fixture, 'button');
      expect(modalOpenSpy).toHaveBeenCalled();
    });

    it('should call confirm if modal is accepted', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue(modalMock);
      modalMock.result = new Promise((resolve, _reject) => resolve(true));
      const confirmSpy = spyOn(component, 'confirm').and.callThrough();

      clickElement(fixture, 'button');
      tick();

      expect(confirmSpy).toHaveBeenCalled();

    }));

    it('should call reject if modal is rejected', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue(modalMock);
      modalMock.result = new Promise((_resolve, reject) => reject(true));
      const rejectSpy = spyOn(component, 'reject').and.callThrough();

      clickElement(fixture, 'button');
      tick();

      expect(rejectSpy).toHaveBeenCalled();
    }));
  });

  describe('with custom texts', () => {
    let fixture: ComponentFixture<CustomHostComponent>;
    let component: CustomHostComponent;
    
    let modalService: NgbModal;
    let modalMock: NgbModalRef = new NgbConfirmModalRefMock() as NgbModalRef;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ConfirmDirective, CustomHostComponent],
        providers: [
          { provide: NgbModal },
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(CustomHostComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      modalService = TestBed.inject(NgbModal);      
    });

    it('should open a modal if attached element is clicked', () => {
      spyOn(modalService, 'open').and.returnValue(modalMock);

      clickElement(fixture, 'button');

      expect(modalMock.componentInstance.title).toEqual(component.title);
      expect(modalMock.componentInstance.text).toEqual(component.text);
    });
  });
});
