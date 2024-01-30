import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { clickElement, getHTMLElement } from 'src/testutils/utils';

import { ConfirmModalComponent } from './confirm-modal.component';

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmModalComponent],
      providers: [NgbActiveModal]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show default texts', () => {
    const header = getHTMLElement(fixture, 'h4[class=modal-title]')
    expect(header.textContent).toEqual('Are you sure?');

    const defaultText = getHTMLElement(fixture, '#defaultText')
    expect(defaultText).toBeTruthy();
    expect(defaultText.textContent).toEqual('This is a potentially risky operation. Are you sure you want to continue?');
  });

  it('should show custom texts', () => {
    const text: string = 'some Text';
    const title: string = 'some Header';

    component.text = text;
    component.title = title;

    fixture.detectChanges();

    const header = getHTMLElement(fixture, 'h4[class=modal-title]')
    expect(header.textContent).toEqual(title);

    const customText = getHTMLElement(fixture, '#customText')
    expect(customText).toBeTruthy();
    expect(customText.textContent).toEqual(text);
  });

  it('should close when the postive button is pressed', () => {
    const closeSpy = spyOn(component.activeModal, 'close');

    clickElement(fixture, 'button[class="btn btn-success"]')

    expect(closeSpy).toHaveBeenCalled();
  });

  it('should dismiss when the negative button is pressed', () => {
    const dismissSpy = spyOn(component.activeModal, 'dismiss');

    clickElement(fixture, 'button[class="btn btn-danger"]')

    expect(dismissSpy).toHaveBeenCalled();
  });
});
