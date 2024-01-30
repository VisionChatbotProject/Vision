import { HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { IAnswerOption } from 'src/app/core/models/answer_options';
import { AnswerOptionListComponentMock } from 'src/testutils/component-mocks';
import { dummyAnswerOption, dummyQuestion, dummyQuestionnaire, dummyQuestions } from 'src/testutils/object-mocks';
import { authoringApiServiceMock } from 'src/testutils/service-mocks';
import { clickElement, getHTMLElement } from 'src/testutils/utils';

import { QuestionListComponent } from './question-list.component';

describe('QuestionListComponent', () => {
  let component: QuestionListComponent;
  let fixture: ComponentFixture<QuestionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionListComponent , AnswerOptionListComponentMock ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add an answer option', () => {
    component.questions = dummyQuestions;
    fixture.detectChanges();
    const addAnswerOptionSpy = spyOn(component, 'addAnswerOptionProxy').and.callThrough();
    let childDebugElement = fixture.debugElement.query(By.directive(AnswerOptionListComponentMock));
    childDebugElement.componentInstance.addAnswerOption.emit();
    expect(addAnswerOptionSpy).toHaveBeenCalled();
  });

  it('should edit an answer option', () => {
    component.questions = dummyQuestions;
    fixture.detectChanges();
    const editAnswerOptionSpy = spyOn(component, 'editAnswerOptionProxy').and.callThrough();
    let childDebugElement = fixture.debugElement.query(By.directive(AnswerOptionListComponentMock));
    childDebugElement.componentInstance.editAnswerOption.emit();
    expect(editAnswerOptionSpy).toHaveBeenCalled();
  });

  it('should delete an answer option', () => {
    component.questions = dummyQuestions;
    fixture.detectChanges();
    const deleteAnswerOptionSpy = spyOn(component, 'deleteAnswerOptionProxy').and.callThrough();
    let childDebugElement = fixture.debugElement.query(By.directive(AnswerOptionListComponentMock));
    childDebugElement.componentInstance.deleteAnswerOption.emit();
    expect(deleteAnswerOptionSpy).toHaveBeenCalled();
  });

});
