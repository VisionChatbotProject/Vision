import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SaveTaskComponent } from '../../modals/save-task/save-task.component';
import { ITask } from '../../models/task.model';

@Component({
  selector: 'int-task-container',
  templateUrl: './task-container.component.html',
  styleUrls: ['./task-container.component.scss']
})
export class TaskContainerComponent {

  private _tasks: ITask[] = [];
  @Input() public set tasks(i: ITask[]) { this._tasks = i; }
  public get tasks(): ITask[] { return this._tasks; }
  
  @Output() public addTask: EventEmitter<ITask> = new EventEmitter();
  @Output() public editTask: EventEmitter<ITask> = new EventEmitter();
  @Output() public deleteTask: EventEmitter<ITask> = new EventEmitter();

  constructor(
    private _ngbModal: NgbModal
  ) { }

  public createTask(): void {
    const modal: NgbModalRef = this._ngbModal.open(SaveTaskComponent, SaveTaskComponent.MODAL_OPTIONS);
    modal.result.then(task => this.onAddTask(task));
  }

  public modifyTask(task: ITask): void {
    const modal: NgbModalRef = this._ngbModal.open(SaveTaskComponent, SaveTaskComponent.MODAL_OPTIONS);
    modal.componentInstance.task = task;
    modal.result.then(task => this.onEditTask(task));
  }

  public onAddTask(task: ITask): void {
    this.addTask.emit(task);
  }

  public onEditTask(task: ITask): void {
    this.editTask.emit(task);
  }

  public onDeleteTask(task: ITask): void {
    this.deleteTask.emit(task);
  }

}
