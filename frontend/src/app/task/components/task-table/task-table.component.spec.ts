import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Table, TableModule } from 'primeng/table';
import { dummyTasks } from 'src/testutils/object-mocks';
import { clickElement, getAllHTMLElements, getHTMLElement } from 'src/testutils/utils';

import { TaskTableComponent } from './task-table.component';

describe('TaskTableComponent', () => {
  let component: TaskTableComponent;
  let fixture: ComponentFixture<TaskTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskTableComponent, Table ],
      imports: [TableModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display tasks set via input', () => {
    component.tasks = dummyTasks;
    fixture.detectChanges();

    expect(getAllHTMLElements(fixture, 'tr').length).toBe(3)
  });

  it('should emit an event on editing tasks', fakeAsync(() => {
    component.tasks = dummyTasks;
    const editSpy = spyOn(component.editTask, 'emit');
    fixture.detectChanges();

    
    clickElement(fixture, '#edit-' + dummyTasks[0].id);
    tick();

    expect(editSpy).toHaveBeenCalledWith(dummyTasks[0]);
  }));

  it('should emit an event on deleting tasks', fakeAsync(() => {
    component.tasks = dummyTasks;
    const deleteSpy = spyOn(component.deleteTask, 'emit');
    fixture.detectChanges();

    
    clickElement(fixture, '#delete-' + dummyTasks[0].id);
    tick();

    expect(deleteSpy).toHaveBeenCalledWith(dummyTasks[0]);
  }));

});
