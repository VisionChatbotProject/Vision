import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbAccordion, NgbAccordionModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableModule } from 'primeng/table';
import { FontAwesomeIconsModuleMock } from 'src/testutils/built-in-mocks';
import { dummyQuestionnaires } from 'src/testutils/object-mocks';
import { clickElement, getHTMLElement } from 'src/testutils/utils';

import { QuestionnaireTableComponent } from './questionnaire-table.component';

describe('QuestionnaireTableComponent', () => {
  let component: QuestionnaireTableComponent;
  let fixture: ComponentFixture<QuestionnaireTableComponent>;
  let router: Router;

  const createQuestionnaireBtnId: string = '#createQuestionnaireButton';
  const noQuestionnairesDesc: string = '#noQuestionnairesDescription';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionnaireTableComponent],
      imports: [CommonModule, RouterTestingModule, FontAwesomeIconsModuleMock, TableModule, NgbAccordionModule],
      providers: [
        { provide: NgbModal },
        { provide: NgbAccordion },
      ]
    }).compileComponents();
  });

  describe('w/ questionnaires', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(QuestionnaireTableComponent);
      component = fixture.componentInstance;
      component.questionnaires = dummyQuestionnaires;

      router = TestBed.inject(Router);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should not show the "createQuestionnaire" button and header when there are questionnaires', () => {
      expect(getHTMLElement(fixture, createQuestionnaireBtnId)).toBeFalsy();
      expect(getHTMLElement(fixture, noQuestionnairesDesc)).toBeFalsy();
    });

    it('should emit "open" with the questionnaireId of the questionnaire when "editQuestionnaire" is clicked', () => {
      const btnId = `#btn-openQuestionnaire-${dummyQuestionnaires[0].id}`;
      const openQuestionnaireSpy = spyOn(component.openQuestionnaire, 'emit');
      
      clickElement(fixture, btnId);
      expect(openQuestionnaireSpy).toHaveBeenCalledWith(dummyQuestionnaires[0].id);
    });

    it('should emit "delete" with the questionnaireId of the questionnaire when "editQuestionnaire" is clicked', () => {
      const btnId = `#btn-deleteQuestionnaire-${dummyQuestionnaires[0].id}`;
      const openQuestionnaireSpy = spyOn(component.deleteQuestionnaire, 'emit');

      const debugElem = fixture.debugElement.query(By.css(btnId));
      debugElem.triggerEventHandler('confirm', {});
      expect(openQuestionnaireSpy).toHaveBeenCalledWith(dummyQuestionnaires[0].id);
    });
  });

  describe('w/o questionnaires', () => {

    beforeEach(() => {
      fixture = TestBed.createComponent(QuestionnaireTableComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show the "createQuestionnaire" button and header when there are no questionnaires', () => {
      expect(getHTMLElement(fixture, createQuestionnaireBtnId)).toBeTruthy();
      expect(getHTMLElement(fixture, noQuestionnairesDesc)).toBeTruthy();
    });

    it('should emit "addQuestionnaire" when the "createQuestionnaire" button is clicked', () => {       
      const addQuestionnaireSpy = spyOn(component.addQuestionnaire, 'emit');

      clickElement(fixture, createQuestionnaireBtnId);
      expect(addQuestionnaireSpy).toHaveBeenCalled();
    });
  });  
});
