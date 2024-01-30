import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IExam } from '../../models/exam.model';

@Component({
  selector: 'int-exam-table',
  templateUrl: './exam-table.component.html',
  styleUrls: ['./exam-table.component.scss']
})
export class ExamTableComponent implements OnInit {

  private _exams: IExam[] = [];
  @Input() public set exams(i: IExam[]) { this._exams = i; }
  public get exams(): IExam[] { return this._exams; }
  
  @Output() public editExam: EventEmitter<IExam> = new EventEmitter();
  @Output() public deleteExam: EventEmitter<IExam> = new EventEmitter();
  
  constructor() { }

  ngOnInit(): void {
  }

  public onEditExam(exam: IExam): void {
    this.editExam.emit(exam);
  }

  public onDeleteExam(exam: IExam): void {
    this.deleteExam.emit(exam);
  }


}
