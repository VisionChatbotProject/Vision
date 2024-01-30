import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SaveExamComponent } from '../../modals/save-exam/save-exam.component';
import { IExam } from '../../models/exam.model';

@Component({
  selector: 'int-exam-container',
  templateUrl: './exam-container.component.html',
  styleUrls: ['./exam-container.component.scss']
})
export class ExamContainerComponent {

  private _exams: IExam[] = [];
  @Input() public set exams(i: IExam[]) { this._exams = i; }
  public get exams(): IExam[] { return this._exams; }
  

  @Output() public addExam: EventEmitter<IExam> = new EventEmitter();
  @Output() public editExam: EventEmitter<IExam> = new EventEmitter();
  @Output() public deleteExam: EventEmitter<IExam> = new EventEmitter();

  constructor(
    private _ngbModal: NgbModal
  ) { }

  public createExam(): void {
    const modal: NgbModalRef = this._ngbModal.open(SaveExamComponent, SaveExamComponent.MODAL_OPTIONS);
    modal.result.then(exam => this.onAddExam(exam));
  }

  public modifyExam(exam: IExam): void {
    const modal: NgbModalRef = this._ngbModal.open(SaveExamComponent, SaveExamComponent.MODAL_OPTIONS);
    modal.componentInstance.exam = exam;
    modal.result.then(exam => this.onEditExam(exam));
  }

  public onAddExam(exam: IExam): void {
    this.addExam.emit(exam);
  }

  public onEditExam(exam: IExam): void {
    this.editExam.emit(exam);
  }

  public onDeleteExam(exam: IExam): void {
    this.deleteExam.emit(exam);
  }

}
