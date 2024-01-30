import { CommonModule } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgbAccordionModule, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeIconsModuleMock } from 'src/testutils/built-in-mocks';
import { TaskTableComponentMock, NgbModalRefMock } from 'src/testutils/component-mocks';
import { dummyTasks } from 'src/testutils/object-mocks';
import { clickElement, getHTMLElement } from 'src/testutils/utils';

import { TaskContainerComponent } from './task-container.component';

describe('TaskContainerComponent', () => {
  let component: TaskContainerComponent;
  let fixture: ComponentFixture<TaskContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskContainerComponent, TaskTableComponentMock ],
      imports: [CommonModule, FontAwesomeIconsModuleMock, NgbAccordionModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a container message if no tasks are set', () => {
    component.tasks = dummyTasks;
    fixture.detectChanges();

    expect(getHTMLElement(fixture, 'noTasksContainer')).toBeDefined()
  });

  it('should display tasks set via input', () => {
    component.tasks = dummyTasks;
    fixture.detectChanges();

    expect(getHTMLElement(fixture, 'noTasksContainer')).toBe(null)
  });

  it('should open a modal for adding tasks and emit an event', fakeAsync(() => {
    let modalMock = new NgbModalRefMock();
    let modalService = TestBed.inject(NgbModal);
    const modalServiceSpy = spyOn(modalService, 'open').and.returnValue(modalMock as NgbModalRef);
    const addTaskSpy = spyOn(component.addTask, 'emit');
    
    modalMock.result = new Promise((resolve, _) => resolve(dummyTasks[0]));

    clickElement(fixture, '#addTaskButton');
    tick();

    expect(modalServiceSpy).toHaveBeenCalled();
    expect(addTaskSpy).toHaveBeenCalledWith(dummyTasks[0]);
  }));

  it('should open a modal for modifying tasks and emit an event', fakeAsync(() => {
    let modalMock = new NgbModalRefMock();
    let modalService = TestBed.inject(NgbModal);
    const modalServiceSpy = spyOn(modalService, 'open').and.returnValue(modalMock as NgbModalRef);
    const modifyTaskSpy = spyOn(component.editTask, 'emit');
    
    modalMock.result = new Promise((resolve, _) => resolve(dummyTasks[0]));

    component.modifyTask(dummyTasks[0]);
    tick();

    expect(modalServiceSpy).toHaveBeenCalled();
    expect(modifyTaskSpy).toHaveBeenCalledWith(dummyTasks[0]);
  }));

  it('should emit an event if an task is to be deleted', fakeAsync(() => {
    const deleteTaskSpy = spyOn(component.deleteTask, 'emit').and.callThrough();
    
    component.onDeleteTask(dummyTasks[0]);
    tick();

    expect(deleteTaskSpy).toHaveBeenCalledWith(dummyTasks[0]);
  }));

});
