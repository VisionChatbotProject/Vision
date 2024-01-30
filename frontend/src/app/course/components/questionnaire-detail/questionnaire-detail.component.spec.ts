import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbAccordionModule, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TableModule } from 'primeng/table';
import { of } from 'rxjs';
import { IQuestionnaire } from 'src/app/core/models/questionnaire';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { FontAwesomeIconsModuleMock } from 'src/testutils/built-in-mocks';
import { CourseDetailMock, CoursePreviewMock, NgbModalRefMock } from 'src/testutils/component-mocks';
import { dummyAnswerOption, dummyAnswerOptions, dummyCourse, dummyQuestion, dummyQuestionnaire, dummyQuestions } from 'src/testutils/object-mocks';
import { authoringApiServiceMock } from 'src/testutils/service-mocks';
import { clickElement } from 'src/testutils/utils';
import { AnswerOptionListComponent } from './answer-option-list/answer-option-list.component';
import { QuestionListComponent } from './question-list/question-list.component';

import { QuestionnaireDetailComponent } from './questionnaire-detail.component';

describe('QuestionnaireDetailComponent', () => {
  let component: QuestionnaireDetailComponent;
  let fixture: ComponentFixture<QuestionnaireDetailComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CommonModule,
        FontAwesomeIconsModuleMock,
        NgbAccordionModule,
        TableModule,
        RouterTestingModule.withRoutes([
          { path: 'course', component: CourseDetailMock }
        ])],
      declarations: [QuestionnaireDetailComponent, QuestionListComponent, AnswerOptionListComponent],
      providers: [
        { provide: AuthoringApiService, useValue: authoringApiServiceMock },
        { provide: NgbModal },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    authoringApiServiceMock.questionnaireService.getQuestionnaire.and.returnValue(of(dummyQuestionnaire));
    authoringApiServiceMock.courseService.getCourse.and.returnValue(of(dummyCourse));
    authoringApiServiceMock.questionService.getQuestions.and.returnValue(of(dummyQuestions));
    authoringApiServiceMock.answerOptionService.getAnswerOptions.and.returnValue(of(dummyAnswerOptions));

    fixture = TestBed.createComponent(QuestionnaireDetailComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router)
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should edit the questionnaire', () => {
    component.ngOnInit();
    fixture.detectChanges();

    let editQuestionnaireSpy = spyOn(component, 'editQuestionnaire').and.callThrough();
    let modalMock = new NgbModalRefMock();
    let modalService = TestBed.inject(NgbModal)
    const modalServiceSpy = spyOn(modalService, 'open').and.returnValue(modalMock as NgbModalRef)
    modalMock.result = new Promise((resolve) => resolve(dummyQuestionnaire));

    clickElement(fixture, '#editQuestionnaire');
    expect(editQuestionnaireSpy).toHaveBeenCalled();
    expect(modalServiceSpy).toHaveBeenCalled();
  });

  it('should call deleteQuestionnaire when a deleteButton is clicked', () => {
    const deleteQuestionnaireSpy = spyOn(component, 'deleteQuestionnaire').and.callThrough();
    const deleteQuestionnaireServiceSpy = authoringApiServiceMock.questionnaireService.deleteQuestionnaire.and.returnValue(of(new HttpResponse<null>()));

    const debugElem = fixture.debugElement.query(By.css('#deleteQuestionnaire'));
    debugElem.triggerEventHandler('confirm', {});

    expect(deleteQuestionnaireSpy).toHaveBeenCalled();
    expect(deleteQuestionnaireServiceSpy).toHaveBeenCalled();
  });




  it('should add a question', () => {
    component.ngOnInit();
    fixture.detectChanges();

    let addQuestionSpy = spyOn(component, 'addQuestion').and.callThrough();
    let modalMock = new NgbModalRefMock();
    let modalService = TestBed.inject(NgbModal)
    const modalServiceSpy = spyOn(modalService, 'open').and.returnValue(modalMock as NgbModalRef)
    modalMock.result = new Promise((resolve) => resolve(dummyQuestion));

    clickElement(fixture, '#btn-addQuestion');
    expect(addQuestionSpy).toHaveBeenCalled();
    expect(modalServiceSpy).toHaveBeenCalled();
  });

  it('should edit question', () => {
    component.ngOnInit();
    fixture.detectChanges();

    let editQuestionSpy = spyOn(component, 'editQuestion').and.callThrough();
    let modalMock = new NgbModalRefMock();
    let modalService = TestBed.inject(NgbModal)
    const modalServiceSpy = spyOn(modalService, 'open').and.returnValue(modalMock as NgbModalRef)
    modalMock.result = new Promise((resolve) => resolve(dummyQuestion));

    clickElement(fixture, '#editQuestion');
    expect(editQuestionSpy).toHaveBeenCalled();
    expect(modalServiceSpy).toHaveBeenCalled();
  });

  it('should delete question', () => {
    activatedRoute.snapshot.queryParams = { id: dummyQuestions[0].id };
    fixture.detectChanges();

    const btnId = '#btn-deleteQuestion';
    authoringApiServiceMock.questionService.deleteQuestion.and.returnValue(of())

    const debugElem = fixture.debugElement.query(By.css(btnId));
    debugElem.triggerEventHandler('confirm', {});

    fixture.detectChanges(); //so that the observable is refreshed

    expect(authoringApiServiceMock.questionService.deleteQuestion).toHaveBeenCalledWith(dummyQuestions[0]);
  });


  it('should add a answerOption', () => {
    component.ngOnInit();
    fixture.detectChanges();

    let addQuestionSpy = spyOn(component, 'addAnswerOption').and.callThrough();
    let modalMock = new NgbModalRefMock();
    let modalService = TestBed.inject(NgbModal)
    const modalServiceSpy = spyOn(modalService, 'open').and.returnValue(modalMock as NgbModalRef)
    modalMock.result = new Promise((resolve) => resolve(dummyQuestion));

    clickElement(fixture, '#btn-addAnswerOption');
    expect(addQuestionSpy).toHaveBeenCalled();
    expect(modalServiceSpy).toHaveBeenCalled();
  });

  it('should edit answerOption', () => {
    component.ngOnInit();
    fixture.detectChanges();

    let editQuestionSpy = spyOn(component, 'editAnswerOption').and.callThrough();
    let modalMock = new NgbModalRefMock();
    let modalService = TestBed.inject(NgbModal)
    const modalServiceSpy = spyOn(modalService, 'open').and.returnValue(modalMock as NgbModalRef)
    modalMock.result = new Promise((resolve) => resolve(dummyQuestion));

    clickElement(fixture, '#editAnswerOption');
    expect(editQuestionSpy).toHaveBeenCalled();
    expect(modalServiceSpy).toHaveBeenCalled();
  });

  it('should delete answerOption', () => {
    activatedRoute.snapshot.queryParams = { id: dummyAnswerOptions[0].id };
    fixture.detectChanges();

    const btnId = '#btn-deleteAnswerOption';
    authoringApiServiceMock.answerOptionService.deleteAnswerOption.and.returnValue(of())

    const debugElem = fixture.debugElement.query(By.css(btnId));
    debugElem.triggerEventHandler('confirm', {});

    fixture.detectChanges(); //so that the observable is refreshed

    expect(authoringApiServiceMock.answerOptionService.deleteAnswerOption).toHaveBeenCalledWith(dummyAnswerOptions[0]);
  });


  it('should change route if the courses button is clicked', () => {
    activatedRoute.snapshot.queryParams = { id: dummyCourse.id };
    fixture.detectChanges();

    const openCourseSpy = spyOn(component, 'openCourse').and.callThrough();
    //spyOn(router, 'navigate').and.callFake((_: any[]) => new Promise());
    const navigateSpy = spyOn(router, 'navigate');

    clickElement(fixture, '#course-button');
    expect(openCourseSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['../course'], jasmine.any(Object));
  });


});
