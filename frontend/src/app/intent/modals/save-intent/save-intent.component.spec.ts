import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormArray, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dummyIntents } from 'src/testutils/object-mocks';
import { clickElement } from 'src/testutils/utils';

import { SaveIntentComponent } from './save-intent.component';

describe('SaveIntentComponent', () => {
  let component: SaveIntentComponent;
  let fixture: ComponentFixture<SaveIntentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveIntentComponent ],
      providers: [
        FormBuilder,
        NgbActiveModal,
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveIntentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly patch the form on setting an input intent', () => {
    component.intent = dummyIntents[0];

    expect(component.intentForm.value).toEqual(dummyIntents[0])
  });

  it('should dismiss the modal if "x" is clicked', fakeAsync(() => {
    const dismissalSpy = spyOn(component.activeModal, 'dismiss');
    clickElement(fixture, '#dismissModal');
    tick();

    expect(dismissalSpy).toHaveBeenCalled();
  }));

  it('should close the modal with the new form value if submitted', fakeAsync(() => {
    const closeSpy = spyOn(component.activeModal, 'close');
    component.intent = dummyIntents[0];
    clickElement(fixture, '#submitForm');
    tick();

    expect(closeSpy).toHaveBeenCalledWith(dummyIntents[0]);
  }));

  it('should add intent rows if the plus button is clicked', fakeAsync(() => {
    expect((component.intentForm.get('intents') as FormArray).length == 1)
    
    clickElement(fixture, '#addIntentRow');
    tick();

    expect((component.intentForm.get('intents') as FormArray).length == 2)
  }));

  it('should remove intent rows if the plus button is clicked', fakeAsync(() => {
    expect((component.intentForm.get('intents') as FormArray).length == 1)
    
    clickElement(fixture, '#remove-intent-0');
    tick();

    expect((component.intentForm.get('intents') as FormArray).length == 0)
  }));


});
