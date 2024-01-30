import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormArray, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dummyExams } from 'src/testutils/object-mocks';
import { clickElement } from 'src/testutils/utils';

import { SaveExamComponent } from './save-exam.component';

describe('SaveExamComponent', () => {
  let component: SaveExamComponent;
  let fixture: ComponentFixture<SaveExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveExamComponent ],
      providers: [
        FormBuilder,
        NgbActiveModal,
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dismiss the modal if "x" is clicked', fakeAsync(() => {
    const dismissalSpy = spyOn(component.activeModal, 'dismiss');
    clickElement(fixture, '#dismissModal');
    tick();

    expect(dismissalSpy).toHaveBeenCalled();
  }));

  it('should close the modal with the new form value if submitted', fakeAsync(() => {
    const closeSpy = spyOn(component.activeModal, 'close');
    component.exam = dummyExams[0];
    clickElement(fixture, '#submitForm');
    tick();

    expect(closeSpy).toHaveBeenCalledWith(dummyExams[0]);
  }));

});
