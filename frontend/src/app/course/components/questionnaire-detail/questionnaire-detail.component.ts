import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { tap, switchMap, take, toArray, concatMap } from 'rxjs/operators';
import { ICourse } from 'src/app/core/models/course';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IQuestionnaire } from 'src/app/core/models/questionnaire';
import { SaveQuestionnaireModalComponent } from 'src/app/core-ui/modals/save-questionnaire-modal/save-questionnaire-modal.component';
import { SaveQuestionModalComponent } from 'src/app/core-ui/modals/save-question-modal/save-question-modal.component';
import { IQuestion } from 'src/app/core/models/question';
import { SaveAnswerOptionModalComponent } from 'src/app/core-ui/modals/save-answer-option-modal/save-answer-option-modal.component';
import { IAnswerOption } from 'src/app/core/models/answer_options';

@Component({
  selector: 'app-questionnaire-detail',
  templateUrl: './questionnaire-detail.component.html',
  styleUrls: ['./questionnaire-detail.component.scss']
})
export class QuestionnaireDetailComponent implements OnInit {

  private _questionnaireLoaded$: Observable<boolean> = new Observable();
  public get questionnaireLoaded$(): Observable<boolean> { return this._questionnaireLoaded$; }

  private _questionnaire: IQuestionnaire | undefined = undefined;
  public get questionnaire(): IQuestionnaire | undefined { return this._questionnaire; }

  private _questions: IQuestion[] = [];
  public get questions(): IQuestion[] { return this._questions; }

  private _course: ICourse | undefined = undefined;

  private _answerOptions: IAnswerOption[] = [];
  public get answerOptions(): IAnswerOption[] { return this._answerOptions; }

  constructor(
    private _authoringApi: AuthoringApiService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this._questionnaireLoaded$ = this._loadQuestionnaire();
  }

  private _loadQuestionnaire(): Observable<boolean> {
    this._answerOptions = [];
    return this._authoringApi.questionnaireService.getQuestionnaire(this._activatedRoute.snapshot.queryParams['id']).pipe(
      tap(questionnaire => this._questionnaire = questionnaire),
      switchMap(_ => this._authoringApi.courseService.getCourse(this._questionnaire!.course)),
      tap(course => this._course = course),
      switchMap(_ => this._loadQuestions()),
      switchMap(_ => of(true))
    );
  }

  private _loadQuestions(): Observable<boolean> {
    return this._authoringApi.questionService.getQuestions(this._questionnaire!).pipe(
      tap(questions => this._questions = questions),
      switchMap(questions => from(questions).pipe(
        concatMap(question => this._loadAnswerOptions(question)),
        concatMap(_ => of(true))
      )),
      toArray(),
      switchMap(_ => of(true))
    );
  }

  public openCourse(): void {
    this._router.navigate(['../course'], { relativeTo: this._activatedRoute, queryParams: { 'id': this._course!.id } });
  }

  public editQuestionnaire(): void {
    const modalRef: NgbModalRef = this._modalService.open(SaveQuestionnaireModalComponent, SaveQuestionnaireModalComponent.MODAL_OPTIONS);
    modalRef.componentInstance.course = this._course;
    modalRef.componentInstance.questionnaire = this.questionnaire;
    modalRef.result.then(
      accepted => this._questionnaireLoaded$ = this._loadQuestionnaire()
    );
  }

  public deleteQuestionnaire(): void {
    this._authoringApi.questionnaireService.deleteQuestionnaire({"id": this.questionnaire!.id} as IQuestionnaire).pipe(
      take(1),
    ).subscribe(_ => {
      this.openCourse()
    });
  }


  public addQuestion(): void {
    const modalRef: NgbModalRef = this._modalService.open(SaveQuestionModalComponent, SaveQuestionModalComponent.MODAL_OPTIONS);
    modalRef.componentInstance.course = this._course;
    modalRef.componentInstance.questionnaire = this._questionnaire;
    modalRef.result.then(
      accepted => this._questionnaireLoaded$ = this._loadQuestionnaire()
    );
  }

  public editQuestion(questionId: number): void {
    const modalRef: NgbModalRef = this._modalService.open(SaveQuestionModalComponent, SaveQuestionModalComponent.MODAL_OPTIONS);
    modalRef.componentInstance.question = this._questions.find(question => question.id == questionId);
    modalRef.result.then(
      accepted => this._questionnaireLoaded$ = this._loadQuestionnaire()
    );
  }

  public deleteQuestion(questionId: number): void {
    let question = this._questions.find(question => question.id == questionId);
    this._authoringApi.questionService.deleteQuestion(question!).pipe(
      take(1),
    ).subscribe(_ => {
      this._questionnaireLoaded$ = this._loadQuestionnaire()
    });
  }

  private _loadAnswerOptions(question: IQuestion): Observable<IAnswerOption[]> {
    return this._authoringApi.answerOptionService.getAnswerOptions(question).pipe(
      tap(answerOptions => {
        answerOptions.forEach(answerOption => {
          this._answerOptions.push(answerOption);
        })
      })
    );
  }

  public addAnswerOption(questionId: number): void {
    const modalRef: NgbModalRef = this._modalService.open(SaveAnswerOptionModalComponent, SaveAnswerOptionModalComponent.MODAL_OPTIONS);
    modalRef.componentInstance.question = this._questions.find(question => question.id == questionId);
    modalRef.result.then(
      accepted => this._questionnaireLoaded$ = this._loadQuestionnaire()
    );
  }

  public editAnswerOption(answerOption: IAnswerOption): void {
    const modalRef: NgbModalRef = this._modalService.open(SaveAnswerOptionModalComponent, SaveAnswerOptionModalComponent.MODAL_OPTIONS);
    modalRef.componentInstance.question = this._questions.find(question => question.id == answerOption.question);
    modalRef.componentInstance.answerOption = answerOption;
    modalRef.result.then(
      accepted => this._questionnaireLoaded$ = this._loadQuestionnaire()
    );
  }

  public deleteAnswerOption(answerOption: IAnswerOption): void {
    this._authoringApi.answerOptionService.deleteAnswerOption(answerOption).pipe(
      take(1),
    ).subscribe(_ => {
      this._questionnaireLoaded$ = this._loadQuestionnaire()
    }); 
  }
}
