import { CommonModule } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgbAccordionModule, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeIconsModuleMock } from 'src/testutils/built-in-mocks';
import { ExamTableComponentMock, NgbModalRefMock } from 'src/testutils/component-mocks';
import { dummyExams } from 'src/testutils/object-mocks';
import { clickElement, getHTMLElement } from 'src/testutils/utils';

import { ExamContainerComponent } from './exam-container.component';

describe('ExamContainerComponent', () => {
  let component: ExamContainerComponent;
  let fixture: ComponentFixture<ExamContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamContainerComponent, ExamTableComponentMock ],
      imports: [CommonModule, FontAwesomeIconsModuleMock, NgbAccordionModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a container message if no exams are set', () => {
    component.exams = dummyExams;
    fixture.detectChanges();

    expect(getHTMLElement(fixture, 'noExamsContainer')).toBeDefined()
  });

  it('should display exams set via input', () => {
    component.exams = dummyExams;
    fixture.detectChanges();

    expect(getHTMLElement(fixture, 'noExamsContainer')).toBe(null)
  });

  it('should open a modal for adding exams and emit an event', fakeAsync(() => {
    let modalMock = new NgbModalRefMock();
    let modalService = TestBed.inject(NgbModal);
    const modalServiceSpy = spyOn(modalService, 'open').and.returnValue(modalMock as NgbModalRef);
    const addExamSpy = spyOn(component.addExam, 'emit');
    
    modalMock.result = new Promise((resolve, _) => resolve(dummyExams[0]));

    clickElement(fixture, '#addExamButton');
    tick();

    expect(modalServiceSpy).toHaveBeenCalled();
    expect(addExamSpy).toHaveBeenCalledWith(dummyExams[0]);
  }));

  it('should open a modal for modifying exams and emit an event', fakeAsync(() => {
    let modalMock = new NgbModalRefMock();
    let modalService = TestBed.inject(NgbModal);
    const modalServiceSpy = spyOn(modalService, 'open').and.returnValue(modalMock as NgbModalRef);
    const modifyExamSpy = spyOn(component.editExam, 'emit');
    
    modalMock.result = new Promise((resolve, _) => resolve(dummyExams[0]));

    component.modifyExam(dummyExams[0]);
    tick();

    expect(modalServiceSpy).toHaveBeenCalled();
    expect(modifyExamSpy).toHaveBeenCalledWith(dummyExams[0]);
  }));

  it('should emit an event if an exam is to be deleted', fakeAsync(() => {
    const deleteExamSpy = spyOn(component.deleteExam, 'emit').and.callThrough();
    
    component.onDeleteExam(dummyExams[0]);
    tick();

    expect(deleteExamSpy).toHaveBeenCalledWith(dummyExams[0]);
  }));

});
