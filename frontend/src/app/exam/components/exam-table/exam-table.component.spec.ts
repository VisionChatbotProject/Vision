import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Table, TableModule } from 'primeng/table';
import { dummyExams } from 'src/testutils/object-mocks';
import { clickElement, getAllHTMLElements, getHTMLElement } from 'src/testutils/utils';

import { ExamTableComponent } from './exam-table.component';

describe('ExamTableComponent', () => {
  let component: ExamTableComponent;
  let fixture: ComponentFixture<ExamTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamTableComponent, Table ],
      imports: [TableModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display exams set via input', () => {
    component.exams = dummyExams;
    fixture.detectChanges();

    expect(getAllHTMLElements(fixture, 'tr').length).toBe(3)
  });

  it('should emit an event on editing exams', fakeAsync(() => {
    component.exams = dummyExams;
    const editSpy = spyOn(component.editExam, 'emit');
    fixture.detectChanges();

    
    clickElement(fixture, '#edit-' + dummyExams[0].id);
    tick();

    expect(editSpy).toHaveBeenCalledWith(dummyExams[0]);
  }));

  it('should emit an event on deleting exams', fakeAsync(() => {
    component.exams = dummyExams;
    const deleteSpy = spyOn(component.deleteExam, 'emit');
    fixture.detectChanges();

    
    clickElement(fixture, '#delete-' + dummyExams[0].id);
    tick();

    expect(deleteSpy).toHaveBeenCalledWith(dummyExams[0]);
  }));

});
