import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbAccordionModule, NgbModal, NgbModalRef, NgbPanel } from '@ng-bootstrap/ng-bootstrap';
import { TableModule } from 'primeng/table';
import { of } from 'rxjs';
import { LoadingComponent } from 'src/app/core-ui/components/loading/loading.component';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { FontAwesomeIconsModuleMock } from 'src/testutils/built-in-mocks';
import { IntentContainerComponentMock, NgbModalRefMock } from 'src/testutils/component-mocks';
import { dummyChapter, dummyChapters, dummyCourse, dummyCourses, dummyQuestionnaire, dummyQuestionnaires, dummyOrganization, dummyIntents, dummyExams, dummyTasks } from 'src/testutils/object-mocks';
import { authoringApiServiceMock } from 'src/testutils/service-mocks';
import { clickElement, getHTMLElement, spyOnGetter } from 'src/testutils/utils';
import { ChapterTableComponent } from './chapter-table/chapter-table.component';

import { CourseDetailComponent } from './course-detail.component';
import { QuestionnaireTableComponent } from './questionnaire-table/questionnaire-table.component';
import { IntentTableComponent } from 'src/app/intent/components/intent-table/intent-table.component';
import { IChapter } from 'src/app/core/models/chapter';

describe('CourseDetailComponent', () => {
  let component: CourseDetailComponent;
  let fixture: ComponentFixture<CourseDetailComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CourseDetailComponent, ChapterTableComponent, LoadingComponent, QuestionnaireTableComponent, IntentTableComponent, IntentContainerComponentMock],
      imports: [CommonModule, RouterTestingModule, FontAwesomeIconsModuleMock, NgbAccordionModule, TableModule],
      providers: [
        { provide: AuthoringApiService, useValue: authoringApiServiceMock },
        { provide: NgbModal },
      ]
    })
    .compileComponents();
  });

  describe('general', () => {

    beforeEach(() => {
      authoringApiServiceMock.chapterService.getChapters.and.returnValue(of(dummyChapters));
      authoringApiServiceMock.questionnaireService.getQuestionnaires.and.returnValue(of(dummyQuestionnaires));
      authoringApiServiceMock.courseService.performanceCourse.and.returnValue(of(-1));

      authoringApiServiceMock.contextService.activeOrganization = dummyOrganization;
      spyOnGetter(authoringApiServiceMock.contextService, 'courses').and.returnValue(dummyCourses)
      
      fixture = TestBed.createComponent(CourseDetailComponent);
      component = fixture.componentInstance;
      router = TestBed.inject(Router)
      activatedRoute = TestBed.inject(ActivatedRoute);
    });

    it('should change route if the courses button is clicked', () => {
      activatedRoute.snapshot.queryParams = { id: dummyCourse.id };
      fixture.detectChanges();
      
      const openCourseSpy = spyOn(component, 'openCourses').and.callThrough();
      const navigateSpy = spyOn(router, 'navigate');

      clickElement(fixture, '#courses-button');
      expect(openCourseSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['../'], jasmine.any(Object));
    });

    it('should open modal if the course edit button is clicked', () => {
      activatedRoute.snapshot.queryParams = { id: dummyCourse.id };
      fixture.detectChanges();

      let modalMock = new NgbModalRefMock();
      let modalService = TestBed.inject(NgbModal);
      spyOn(modalService, 'open').and.returnValue(modalMock as NgbModalRef);
      modalMock.result = new Promise((resolve, _) => resolve(dummyCourses[0]));

      let openCourseSpy = spyOn(component, 'editCourse').and.callThrough();
      clickElement(fixture, '#editCourse');
      expect(openCourseSpy).toHaveBeenCalledWith();
    });

    it('should "delete" the course when "deleteCourse" is clicked', () => {
      activatedRoute.snapshot.queryParams = { id: dummyCourse.id };
      fixture.detectChanges();
      
      const btnId = '#btn-deleteCourse';
      authoringApiServiceMock.courseService.deleteCourse.and.returnValue(of(dummyCourse))

      const debugElem = fixture.debugElement.query(By.css(btnId));
      debugElem.triggerEventHandler('confirm', {});

      fixture.detectChanges(); //so that the observable is refreshed

      expect(authoringApiServiceMock.courseService.deleteCourse).toHaveBeenCalledWith(dummyCourse);
    });

    it('should show course name', () => {
      activatedRoute.snapshot.queryParams = { id: dummyCourse.id };
      fixture.detectChanges();

      const debugElem = getHTMLElement(fixture, '#name');
      expect(debugElem.textContent.trim()).toEqual(dummyCourse.name);
    });

    it('should show an error if course id is unknown', () => {
      activatedRoute.snapshot.queryParams = { id: -50 };
      fixture.detectChanges();
      
      const element = getHTMLElement(fixture, '#noCourses')
      expect(element).toBeDefined();
    });

    it('should show an error if course id is missing', () => {
      activatedRoute.snapshot.queryParams = { definitlyNotTheCourseId: -50 };
      fixture.detectChanges();
      
      const element = getHTMLElement(fixture, '#noCourses')
      expect(element).toBeDefined();
    }); 
  });

  describe('w/ chapters', () => {

    beforeEach(() => {
      authoringApiServiceMock.courseService.getCourse.and.returnValue(of(dummyCourse));
      authoringApiServiceMock.chapterService.getChapters.and.returnValue(of(dummyChapters));
      authoringApiServiceMock.questionnaireService.getQuestionnaires.and.returnValue(of(dummyQuestionnaires));
      authoringApiServiceMock.courseService.performanceCourse.and.returnValue(of(-1));
      
      authoringApiServiceMock.contextService.activeOrganization = dummyOrganization;
      spyOnGetter(authoringApiServiceMock.contextService, 'courses').and.returnValue(dummyCourses)

      fixture = TestBed.createComponent(CourseDetailComponent);
      component = fixture.componentInstance;
      router = TestBed.inject(Router)
      activatedRoute = TestBed.inject(ActivatedRoute);
      
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });    

    it('should change route if the course open button is clicked', () => {
      const openCourseSpy = spyOn(component, 'openChapter').and.callThrough();
      const navigateSpy = spyOn(router, 'navigate');

      activatedRoute.snapshot.queryParams = { id: dummyCourse.id };

      fixture.detectChanges();

      const debugElem = fixture.debugElement.query(By.css(`#chapter-table`));
      debugElem.triggerEventHandler('openChapter', dummyChapter.id);
      expect(openCourseSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['../chapter-detail'], jasmine.any(Object));
    });

    it('should open modal if the course edit button is clicked', () => {
      let modalMock = new NgbModalRefMock();
      let modalService = TestBed.inject(NgbModal);
      spyOn(modalService, 'open').and.returnValue(modalMock as NgbModalRef);
      modalMock.result = new Promise((resolve, _) => resolve(dummyChapters[0]));
      const chapterId: number = dummyChapters[0].id;

      activatedRoute.snapshot.queryParams = { id: dummyCourse.id };
      fixture.detectChanges();

      let editChapterSpy = spyOn(component, 'editChapter').and.callThrough();
      const debugElem = fixture.debugElement.query(By.css(`#chapter-table`));
      debugElem.triggerEventHandler('editChapter', chapterId);
      expect(editChapterSpy).toHaveBeenCalledWith(chapterId);
    });

    it('should call deleteChapter when a deleteButton is clicked', waitForAsync(() => {
      activatedRoute.snapshot.queryParams = { id: dummyCourse.id };
      fixture.detectChanges();

      const deleteChapterSpy = authoringApiServiceMock.chapterService.deleteChapter.and.returnValue(of(new HttpResponse<null>()));

      const debugElem = fixture.debugElement.query(By.css(`#chapter-table`));
      debugElem.triggerEventHandler('deleteChapter', dummyChapter.id);
      expect(deleteChapterSpy).toHaveBeenCalled();
    }));
  });

  describe('w/o chapters', () => {
    beforeEach(() => {
      authoringApiServiceMock.courseService.getCourse.and.returnValue(of(dummyCourse));
      authoringApiServiceMock.chapterService.getChapters.and.returnValue(of([]));
      authoringApiServiceMock.questionnaireService.getQuestionnaires.and.returnValue(of([]));
      authoringApiServiceMock.courseService.performanceCourse.and.returnValue(of(-1));

      spyOnGetter(authoringApiServiceMock.contextService, 'courses').and.returnValue(dummyCourses);

      fixture = TestBed.createComponent(CourseDetailComponent);
      component = fixture.componentInstance;
      
      router = TestBed.inject(Router)
      activatedRoute = TestBed.inject(ActivatedRoute);

      activatedRoute.snapshot.queryParams = { id: dummyCourse.id };
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    })

    it('should show a modal for adding a chapter when "addChapter" is called', () => {
      let modalMock = new NgbModalRefMock();
      let modalService = TestBed.inject(NgbModal);
      const modalServiceSpy = spyOn(modalService, 'open').and.returnValue(modalMock as NgbModalRef);
      modalMock.result = new Promise((resolve, _) => resolve(dummyChapter));

      component.addChapter();
      expect(modalServiceSpy).toHaveBeenCalled();
    });
  });

  describe('w/o questionnaires', () => {
    beforeEach(() => {
      authoringApiServiceMock.courseService.getCourse.and.returnValue(of(dummyCourse));
      authoringApiServiceMock.chapterService.getChapters.and.returnValue(of([]));
      authoringApiServiceMock.questionnaireService.getQuestionnaires.and.returnValue(of([]));
      authoringApiServiceMock.courseService.performanceCourse.and.returnValue(of(-1));

      spyOnGetter(authoringApiServiceMock.contextService, 'courses').and.returnValue(dummyCourses);

      fixture = TestBed.createComponent(CourseDetailComponent);
      component = fixture.componentInstance;
      activatedRoute = TestBed.inject(ActivatedRoute);
      router = TestBed.inject(Router)

      activatedRoute.snapshot.queryParams = { id: dummyCourse.id };
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    })

    it('should show a modal for adding a questionnaire when "addQuestionnaire" is called', () => {
      let modalMock = new NgbModalRefMock();
      let modalService = TestBed.inject(NgbModal);
      const modalServiceSpy = spyOn(modalService, 'open').and.returnValue(modalMock as NgbModalRef);
      modalMock.result = new Promise((resolve, _) => resolve(dummyChapter));

      component.addQuestionnaire();
      expect(modalServiceSpy).toHaveBeenCalled();
    });
  });

  describe('w/ questionnaires', () => {

    beforeEach(() => {
      authoringApiServiceMock.courseService.getCourse.and.returnValue(of(dummyCourse));
      authoringApiServiceMock.chapterService.getChapters.and.returnValue(of(dummyChapters));
      authoringApiServiceMock.questionnaireService.getQuestionnaires.and.returnValue(of(dummyQuestionnaires));
      authoringApiServiceMock.courseService.performanceCourse.and.returnValue(of(-1));
      
      spyOnGetter(authoringApiServiceMock.contextService, 'courses').and.returnValue(dummyCourses);

      fixture = TestBed.createComponent(CourseDetailComponent);
      component = fixture.componentInstance;
      router = TestBed.inject(Router)
      activatedRoute = TestBed.inject(ActivatedRoute);

      activatedRoute.snapshot.queryParams = { id: dummyCourse.id };
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should change route if the questionnaire button is clicked', () => {
      activatedRoute.snapshot.queryParams = { id: dummyCourse.id };
      fixture.detectChanges();
      
      const openQuestionnaireSpy = spyOn(component, 'openQuestionnaire').and.callThrough();
      const navigateSpy = spyOn(router, 'navigate');

      const debugElem = fixture.debugElement.query(By.css(`#questionnaire-table`));
      debugElem.triggerEventHandler('openQuestionnaire', dummyQuestionnaire.id);
      expect(openQuestionnaireSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['../questionnaire-detail'], jasmine.any(Object));
    });

    it('should call open modal if the questionnaire edit button is clicked', () => {
      let modalMock = new NgbModalRefMock();
      let modalService = TestBed.inject(NgbModal);

      fixture.detectChanges();
      const modalServiceSpy = spyOn(modalService, 'open').and.returnValue(modalMock as NgbModalRef);
      modalMock.result = new Promise((resolve, _) => resolve(dummyQuestionnaire));
      
      const debugElem = fixture.debugElement.query(By.css(`#questionnaire-table`));
      debugElem.triggerEventHandler('editQuestionnaire', dummyQuestionnaire.id);
      expect(modalServiceSpy).toHaveBeenCalled();
    });

    it('should call deleteQuestionnaire when a deleteButton is clicked', () => {
      const deleteQuestionnaireSpy = authoringApiServiceMock.questionnaireService.deleteQuestionnaire.and.returnValue(of(new HttpResponse<null>()));
      
      const debugElem = fixture.debugElement.query(By.css(`#questionnaire-table`));
      debugElem.triggerEventHandler('deleteQuestionnaire', dummyQuestionnaire.id);
      expect(deleteQuestionnaireSpy).toHaveBeenCalled();
    });
  });
  
  describe('intents', () => {
    beforeEach(() => {
      authoringApiServiceMock.courseService.getCourse.and.returnValue(of(dummyCourse));
      authoringApiServiceMock.chapterService.getChapters.and.returnValue(of([]));
      authoringApiServiceMock.questionnaireService.getQuestionnaires.and.returnValue(of([]));
      authoringApiServiceMock.courseService.performanceCourse.and.returnValue(of(-1));

      spyOnGetter(authoringApiServiceMock.contextService, 'courses').and.returnValue(dummyCourses);

      fixture = TestBed.createComponent(CourseDetailComponent);
      component = fixture.componentInstance;
      
      router = TestBed.inject(Router)
      activatedRoute = TestBed.inject(ActivatedRoute);

      activatedRoute.snapshot.queryParams = { id: dummyCourse.id };
      fixture.detectChanges();
    });

    it('should call addIntent when a event triggered by component', () => {
      authoringApiServiceMock.courseService.addIntent.and.returnValue(of(dummyIntents[0]));
      fixture = TestBed.createComponent(CourseDetailComponent);
      component = fixture.componentInstance;
      const addIntentSpy = spyOn(component, 'addIntent').and.callThrough();
      component.addIntent(dummyIntents[0]);
      expect(addIntentSpy).toHaveBeenCalled();
    });

    it('should call addIntent with none object from form', () => {
      authoringApiServiceMock.courseService.addIntent.and.returnValue(of(dummyIntents[0]));
      fixture = TestBed.createComponent(CourseDetailComponent);
      component = fixture.componentInstance;
      const addIntentSpy = spyOn(component, 'addIntent').and.callThrough();
      dummyIntents[0].chapter = 0;
      component.addIntent(dummyIntents[0]);
      expect(addIntentSpy).toHaveBeenCalled();
      dummyIntents[0].chapter = null;
    });

    it('should call editIntent when a event triggered by component', () => {
      authoringApiServiceMock.courseService.modifyIntent.and.returnValue(of(dummyIntents[0]));
      fixture = TestBed.createComponent(CourseDetailComponent);
      component = fixture.componentInstance;
      const editIntentSpy = spyOn(component, 'editIntent').and.callThrough();
      component.editIntent(dummyIntents[0]);
      expect(editIntentSpy).toHaveBeenCalled();
    });

    it('should call editIntent with none object from form', () => {
      authoringApiServiceMock.courseService.modifyIntent.and.returnValue(of(dummyIntents[0]));
      fixture = TestBed.createComponent(CourseDetailComponent);
      component = fixture.componentInstance;
      dummyIntents[0].chapter = 0;
      const editIntentSpy = spyOn(component, 'editIntent').and.callThrough();
      component.editIntent(dummyIntents[0]);
      expect(editIntentSpy).toHaveBeenCalled();
      dummyIntents[0].chapter = null;
    });

    it('should call deleteIntent when a event triggered by component', () => {
      authoringApiServiceMock.courseService.deleteIntent.and.returnValue(of(dummyIntents[0]));
      fixture = TestBed.createComponent(CourseDetailComponent);
      component = fixture.componentInstance;
      const deleteIntentSpy = spyOn(component, 'deleteIntent').and.callThrough();
      component.deleteIntent(dummyIntents[0]);
      expect(deleteIntentSpy).toHaveBeenCalled();
    });
  });

  describe('exams', () => {
    beforeEach(() => {
      authoringApiServiceMock.courseService.getCourse.and.returnValue(of(dummyCourse));
      authoringApiServiceMock.chapterService.getChapters.and.returnValue(of([]));
      authoringApiServiceMock.questionnaireService.getQuestionnaires.and.returnValue(of([]));
      authoringApiServiceMock.courseService.performanceCourse.and.returnValue(of(-1));

      spyOnGetter(authoringApiServiceMock.contextService, 'courses').and.returnValue(dummyCourses);

      fixture = TestBed.createComponent(CourseDetailComponent);
      component = fixture.componentInstance;
      
      router = TestBed.inject(Router)
      activatedRoute = TestBed.inject(ActivatedRoute);

      activatedRoute.snapshot.queryParams = { id: dummyCourse.id };
      fixture.detectChanges();
    });

    it('should call addExam when a event triggered by component', () => {
      authoringApiServiceMock.courseService.addExam.and.returnValue(of(dummyExams[0]));
      fixture = TestBed.createComponent(CourseDetailComponent);
      component = fixture.componentInstance;
      const addExamSpy = spyOn(component, 'addExam').and.callThrough();
      component.addExam(dummyExams[0]);
      expect(addExamSpy).toHaveBeenCalled();
    });

    it('should call editExam when a event triggered by component', () => {
      authoringApiServiceMock.courseService.modifyExam.and.returnValue(of(dummyExams[0]));
      fixture = TestBed.createComponent(CourseDetailComponent);
      component = fixture.componentInstance;
      const editExamSpy = spyOn(component, 'editExam').and.callThrough();
      component.editExam(dummyExams[0]);
      expect(editExamSpy).toHaveBeenCalled();
    });

    it('should call deleteExam when a event triggered by component', () => {
      authoringApiServiceMock.courseService.deleteExam.and.returnValue(of(dummyExams[0]));
      fixture = TestBed.createComponent(CourseDetailComponent);
      component = fixture.componentInstance;
      const deleteExamSpy = spyOn(component, 'deleteExam').and.callThrough();
      component.deleteExam(dummyExams[0]);
      expect(deleteExamSpy).toHaveBeenCalled();
    });
  });

  describe('tasks', () => {
    beforeEach(() => {
      authoringApiServiceMock.courseService.getCourse.and.returnValue(of(dummyCourse));
      authoringApiServiceMock.chapterService.getChapters.and.returnValue(of([]));
      authoringApiServiceMock.questionnaireService.getQuestionnaires.and.returnValue(of([]));
      authoringApiServiceMock.courseService.performanceCourse.and.returnValue(of(-1));

      spyOnGetter(authoringApiServiceMock.contextService, 'courses').and.returnValue(dummyCourses);

      fixture = TestBed.createComponent(CourseDetailComponent);
      component = fixture.componentInstance;
      
      router = TestBed.inject(Router)
      activatedRoute = TestBed.inject(ActivatedRoute);

      activatedRoute.snapshot.queryParams = { id: dummyCourse.id };
      fixture.detectChanges();
    });

    it('should call addTask when a event triggered by component', () => {
      authoringApiServiceMock.courseService.addTask.and.returnValue(of(dummyTasks[0]));
      fixture = TestBed.createComponent(CourseDetailComponent);
      component = fixture.componentInstance;
      const addTaskSpy = spyOn(component, 'addTask').and.callThrough();
      component.addTask(dummyTasks[0]);
      expect(addTaskSpy).toHaveBeenCalled();
    });

    it('should call editTask when a event triggered by component', () => {
      authoringApiServiceMock.courseService.modifyTask.and.returnValue(of(dummyTasks[0]));
      fixture = TestBed.createComponent(CourseDetailComponent);
      component = fixture.componentInstance;
      const editTaskSpy = spyOn(component, 'editTask').and.callThrough();
      component.editTask(dummyTasks[0]);
      expect(editTaskSpy).toHaveBeenCalled();
    });

    it('should call deleteTask when a event triggered by component', () => {
      authoringApiServiceMock.courseService.deleteTask.and.returnValue(of(dummyTasks[0]));
      fixture = TestBed.createComponent(CourseDetailComponent);
      component = fixture.componentInstance;
      const deleteTaskSpy = spyOn(component, 'deleteTask').and.callThrough();
      component.deleteTask(dummyTasks[0]);
      expect(deleteTaskSpy).toHaveBeenCalled();
    });
  });

  describe('extras', () => {
    beforeEach(() => {
      authoringApiServiceMock.courseService.getCourse.and.returnValue(of(dummyCourse));
      authoringApiServiceMock.chapterService.getChapters.and.returnValue(of([]));
      authoringApiServiceMock.questionnaireService.getQuestionnaires.and.returnValue(of([]));
      authoringApiServiceMock.courseService.performanceCourse.and.returnValue(of(-1));

      spyOnGetter(authoringApiServiceMock.contextService, 'courses').and.returnValue(dummyCourses);

      fixture = TestBed.createComponent(CourseDetailComponent);
      component = fixture.componentInstance;
      
      router = TestBed.inject(Router)
      activatedRoute = TestBed.inject(ActivatedRoute);

      activatedRoute.snapshot.queryParams = { id: dummyCourse.id };
      fixture.detectChanges();
    });

    it('should call exportCourse when a event triggered by component', () => {
      authoringApiServiceMock.courseService.exportCourse.and.returnValue(of(null));
      fixture = TestBed.createComponent(CourseDetailComponent);
      const exportCourseSpy = spyOn(component, 'exportCourse').and.callThrough();
      component.exportCourse();
      expect(exportCourseSpy).toHaveBeenCalled();
    });

    it('should call previewCourse when a event triggered by component', () => {
      authoringApiServiceMock.courseService.previewCourse.and.returnValue(of(null));
      fixture = TestBed.createComponent(CourseDetailComponent);
      const previewCourseSpy = spyOn(component, 'previewCourse').and.callThrough();
      component.previewCourse();
      expect(previewCourseSpy).toHaveBeenCalled();
    });

    it('should call trainCourse when a event triggered by component', () => {
      authoringApiServiceMock.courseService.trainCourse.and.returnValue(of(null));
      fixture = TestBed.createComponent(CourseDetailComponent);
      const trainCourseSpy = spyOn(component, 'trainCourse').and.callThrough();
      component.trainCourse();
      expect(trainCourseSpy).toHaveBeenCalled();
    });

    it('should have no chapter assigned', () => {
      let result = component.isChapterNotAssigned(dummyChapter);
      expect(result).toEqual(true);
    });

    it('should have chapter assigned', () => {
      dummyQuestionnaires[0].chapter = dummyChapter.id;
      const questionnairesSpy = spyOnProperty(component, 'questionnaires').and.returnValue(dummyQuestionnaires);
      let result = component.isChapterNotAssigned(dummyChapter);
      expect(questionnairesSpy).toHaveBeenCalled();
      expect(result).toEqual(false);
      dummyQuestionnaires[0].chapter = null;
    });

    it('should have all chapters assignable', () => {
      dummyQuestionnaires[0].chapter = dummyChapter.id;
      const chaptersSpy = spyOnProperty(component, 'chapters').and.returnValue(dummyChapters);
      let result = component.getAssignableChapters();
      let c: IChapter = {
        title: '-',
        course: 0,
        shortDescription: "",
        longDescription: "",
        id: 0,
        order: 0
      };
      let chapters = [c].concat(dummyChapters);
      expect(chaptersSpy).toHaveBeenCalled();
      expect(result.length).toEqual(chapters.length);
    });

    it('should have one not assignable chapters', () => {
      dummyQuestionnaires[0].chapter = dummyChapter.id;
      const chaptersSpy = spyOnProperty(component, 'chapters').and.returnValue(dummyChapters);
      let c: IChapter = {
        title: '-',
        course: 0,
        shortDescription: "",
        longDescription: "",
        id: 0,
        order: 0
      };
      let chapters = [c].concat(dummyChapters);
      let result = component.getAssignableChapters(dummyQuestionnaires[0]);
      expect(chaptersSpy).toHaveBeenCalled();
      expect(result.length).toEqual(chapters.length-1);
      dummyQuestionnaires[0].chapter = null;
    });

  });

});