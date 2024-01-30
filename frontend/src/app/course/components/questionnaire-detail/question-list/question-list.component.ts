import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IAnswerOption } from 'src/app/core/models/answer_options';
import { IQuestion } from 'src/app/core/models/question';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit {

  private _questions: IQuestion[] = [];
  @Input() public set questions(questions: IQuestion[]) { this._questions = questions};
  public get questions(): IQuestion[] { return this._questions; }

  private _answerOptions: IAnswerOption[] = [];
  @Input() public set answerOptions(answerOptions: IAnswerOption[]) { this._answerOptions = answerOptions};
  public get answerOptions(): IAnswerOption[] { return this._answerOptions; }

  constructor(
  ) { }

  ngOnInit(): void {
  }

  @Output() addQuestion: EventEmitter<void> = new EventEmitter<void>();
  @Output() editQuestion: EventEmitter<number> = new EventEmitter<number>();
  @Output() deleteQuestion: EventEmitter<number> = new EventEmitter<number>();
  @Output() addAnswerOption: EventEmitter<number> = new EventEmitter<number>();
  @Output() editAnswerOption: EventEmitter<IAnswerOption> = new EventEmitter<IAnswerOption>();
  @Output() deleteAnswerOption: EventEmitter<IAnswerOption> = new EventEmitter<IAnswerOption>();

  public addQuestionProxy(): void {
    this.addQuestion.emit();
  }

  public editQuestionProxy(questionId: number): void {
    this.editQuestion.emit(questionId);
  }

  public deleteQuestionProxy(questionId: number): void {
    this.deleteQuestion.emit(questionId);
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
