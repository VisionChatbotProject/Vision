import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormArray, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dummyTasks } from 'src/testutils/object-mocks';
import { clickElement } from 'src/testutils/utils';

import { SaveTaskComponent } from './save-task.component';

describe('SaveTaskComponent', () => {
  let component: SaveTaskComponent;
  let fixture: ComponentFixture<SaveTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveTaskComponent ],
      providers: [
        FormBuilder,
        NgbActiveModal,
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveTaskComponent);
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
    component.task = dummyTasks[0];
    clickElement(fixture, '#submitForm');
    tick();

    expect(closeSpy).toHaveBeenCalledWith(dummyTasks[0]);
  }));

});
