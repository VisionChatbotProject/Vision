import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IAnswerOption } from 'src/app/core/models/answer_options';
import { IQuestion } from 'src/app/core/models/question';

@Component({
  selector: 'app-answer-option-list',
  templateUrl: './answer-option-list.component.html',
  styleUrls: ['./answer-option-list.component.scss']
})
export class AnswerOptionListComponent implements OnInit {

  private _question: IQuestion | undefined;
  @Input() public set question(question: IQuestion | undefined) { this._question = question };
  public get question(): IQuestion | undefined { return this._question; }

  private _answerOptions: IAnswerOption[] = [];
  @Input() public set answerOptions(answerOptions: IAnswerOption[]) { this._answerOptions = answerOptions };
  public get answerOptions(): IAnswerOption[] { return this._answerOptions; }

  constructor() { }

  ngOnInit(): void {
  }

  @Output() addAnswerOption: EventEmitter<number> = new EventEmitter<number>();
  @Output() editAnswerOption: EventEmitter<IAnswerOption> = new EventEmitter<IAnswerOption>();
  @Output() deleteAnswerOption: EventEmitter<IAnswerOption> = new EventEmitter<IAnswerOption>();

  public getAnswerOptions(question: IQuestion | undefined): IAnswerOption[] {
    return this._answerOptions.filter(answerOption => answerOption.question == question!.id);
  }

  public addAnswerOptionProxy(questionId: number): void {
    this.addAnswerOption.emit(questionId);
  }

  public editAnswerOptionProxy(answerOption: IAnswerOption): void {
    this.editAnswerOption.emit(answerOption);
  }

  public deleteAnswerOptionProxy(answerOption: IAnswerOption): void {
    this.deleteAnswerOption.emit(answerOption);
  }
}