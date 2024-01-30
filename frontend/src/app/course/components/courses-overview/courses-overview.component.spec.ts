import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbAccordionModule, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CourseTableMock, NgbModalRefMock, PanelToggleMock } from 'src/testutils/component-mocks';
import { CoursesOverviewComponent } from './courses-overview.component';
import { dummyCourse } from 'src/testutils/object-mocks';
import { clickElement } from 'src/testutils/utils';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { authoringApiServiceMock } from 'src/testutils/service-mocks';


describe('CoursesOverviewComponent', () => {
  let component: CoursesOverviewComponent;
  let fixture: ComponentFixture<CoursesOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoursesOverviewComponent, CourseTableMock, PanelToggleMock],
      imports: [NgbAccordionModule],
      providers: [
        { provide: AuthoringApiService, useValue: authoringApiServiceMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a modal for adding a course and reload them', () => {
    fixture.detectChanges();

    let modalMock = new NgbModalRefMock();
    let modalService = TestBed.inject(NgbModal)
    const modalServiceSpy = spyOn(modalService, 'open').and.returnValue(modalMock as NgbModalRef)
    modalMock.result = new Promise((resolve) => resolve(dummyCourse));

    clickElement(fixture, '#addCourseButton');

    expect(modalServiceSpy).toHaveBeenCalled();
  });

});
