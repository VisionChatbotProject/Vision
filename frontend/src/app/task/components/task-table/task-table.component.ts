import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITask } from '../../models/task.model';

@Component({
  selector: 'int-task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.scss']
})
export class TaskTableComponent implements OnInit {

  private _tasks: ITask[] = [];
  @Input() public set tasks(i: ITask[]) { this._tasks = i; }
  public get tasks(): ITask[] { return this._tasks; }
  
  @Output() public editTask: EventEmitter<ITask> = new EventEmitter();
  @Output() public deleteTask: EventEmitter<ITask> = new EventEmitter();
  
  constructor() { }

  ngOnInit(): void {
  }

  public onEditTask(task: ITask): void {
    this.editTask.emit(task);
  }

  public onDeleteTask(task: ITask): void {
    this.deleteTask.emit(task);
  }


}
