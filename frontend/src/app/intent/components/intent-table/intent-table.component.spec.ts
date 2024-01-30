import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Table, TableModule } from 'primeng/table';
import { dummyIntents } from 'src/testutils/object-mocks';
import { clickElement, getAllHTMLElements, getHTMLElement } from 'src/testutils/utils';

import { IntentTableComponent } from './intent-table.component';

describe('IntentTableComponent', () => {
  let component: IntentTableComponent;
  let fixture: ComponentFixture<IntentTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntentTableComponent, Table ],
      imports: [TableModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display intents set via input', () => {
    component.intents = dummyIntents;
    fixture.detectChanges();

    expect(getAllHTMLElements(fixture, 'tr').length).toBe(3)
  });

  it('should emit an event on editing intents', fakeAsync(() => {
    component.intents = dummyIntents;
    const editSpy = spyOn(component.editIntent, 'emit');
    fixture.detectChanges();

    
    clickElement(fixture, '#edit-' + dummyIntents[0].id);
    tick();

    expect(editSpy).toHaveBeenCalledWith(dummyIntents[0]);
  }));

  it('should emit an event on deleting intents', fakeAsync(() => {
    component.intents = dummyIntents;
    const deleteSpy = spyOn(component.deleteIntent, 'emit');
    fixture.detectChanges();

    
    clickElement(fixture, '#delete-' + dummyIntents[0].id);
    tick();

    expect(deleteSpy).toHaveBeenCalledWith(dummyIntents[0]);
  }));

});
