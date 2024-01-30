import { HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbAccordionModule, NgbDropdownModule, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { IChapter } from 'src/app/core/models/chapter';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { EEditorState } from 'src/app/grapesjs/interfaces/common.interface';
import { GrapesManagerService } from 'src/app/grapesjs/services/grapes-manager/grapes-manager.service';
import { FontAwesomeIconsModuleMock } from 'src/testutils/built-in-mocks';
import { GrapesJsHolderMock, NgbModalRefMock } from 'src/testutils/component-mocks';
import { ConfirmDirectiveMock } from 'src/testutils/directive-mocks';
import { dummyChapter, dummyCourse, dummySlide, dummySlides } from 'src/testutils/object-mocks';
import { authoringApiServiceMock } from 'src/testutils/service-mocks';
import { clickElement, getHTMLElement } from 'src/testutils/utils';

import { ChapterProcessingComponent } from './chapter-processing.component';

describe('chapterProcessingComponent', () => {
  let component: ChapterProcessingComponent;
  let fixture: ComponentFixture<ChapterProcessingComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChapterProcessingComponent, GrapesJsHolderMock, ConfirmDirectiveMock],
      providers: [
        { provide: AuthoringApiService, useValue: authoringApiServiceMock },
        { provide: NgbModal },
        { provide: FormBuilder },
        { provide: GrapesManagerService }
      ],
      imports: [NgbDropdownModule, NgbAccordionModule, ReactiveFormsModule, FontAwesomeIconsModuleMock, RouterTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    authoringApiServiceMock.chapterService.getChapter.and.returnValue(of(dummyChapter));
    authoringApiServiceMock.courseService.getCourse.and.returnValue(of(dummyCourse));
    fixture = TestBed.createComponent(ChapterProcessingComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  describe('general', () => {

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should open a course when the button is clicked', () => {
      let chapter : IChapter = dummyChapter;
      component.chapterId = chapter.id;
      fixture.detectChanges();
  
      let openChapterSpy = spyOn(component, 'openChapterDetails').and.callThrough();
      let navigateSpy = spyOn(router, 'navigate');
      clickElement(fixture, '#chapter-details-button');
      expect(openChapterSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['../chapter-detail'], jasmine.any(Object));
    });

    it('should set the selected slide from a valid query parameter', () => {
      const slideId: number = 1337;
      const spyRoute = spyOn(activatedRoute.snapshot.queryParamMap, 'get').withArgs('slideId').and.returnValue(`${slideId}`);
      fixture.detectChanges();

      expect(component.selectedSlide).toBeFalsy();
      component.ngOnInit();
      expect(spyRoute).toHaveBeenCalled();
      expect(component.selectedSlide!.id).toEqual(slideId);
    });

    it('should ignore invalid slideIDs', () => {
      const spyRoute = spyOn(activatedRoute.snapshot.queryParamMap, 'get').withArgs('slideId').and.returnValue('');
      fixture.detectChanges();

      expect(component.selectedSlide).toBeFalsy();
      component.ngOnInit();
      expect(spyRoute).toHaveBeenCalled();
      expect(component.selectedSlide).toBeFalsy();
    });

    it('should pass an invalid slideID when "null" is selected', () => {
      const routerSpy = spyOn(router, 'navigate');
      fixture.detectChanges();

      component.selectedSlide = null;
      expect(routerSpy).toHaveBeenCalledWith([], 
        jasmine.objectContaining({
        'queryParams': { 'slideId': undefined }, 
        })
      );
    })
  });

  describe('w/ slides', () => {
    beforeEach(() => {
      authoringApiServiceMock.slideService.getSlides.and.returnValue(of(dummySlides));
      component.chapterId = dummyChapter.id;
      
      fixture.detectChanges();
    });

    it('should open the add slide modal and reload slides if requested', () => {
      let modalMock = new NgbModalRefMock();
      let modalService = TestBed.inject(NgbModal);
      const modalServiceSpy = spyOn(modalService, 'open').and.returnValue(modalMock as NgbModalRef);
      modalMock.result = new Promise((resolve, _) => resolve(dummySlide));
  
      clickElement(fixture, '#btn-addSlide');
  
      expect(modalServiceSpy).toHaveBeenCalled();
    });

    it('should update the slide content when a save is requested', done => {
      authoringApiServiceMock.slideService.updateSlideContent.and.returnValue(of(new HttpResponse()));
      component['_grapesManager'].onStore(['someData'], done, () => { expect(true).toBeFalse(); })

      expect(authoringApiServiceMock.slideService.updateSlideContent).toHaveBeenCalled();
    });

    it('should load the slide content when a save is requested', done => {
      authoringApiServiceMock.commonService.getBlob.and.returnValue(of(new Blob([JSON.stringify({ data: 'any'})])));
      component['_grapesManager'].onLoad(['someData'], done, () => { expect(true).toBeFalse(); })

      expect(authoringApiServiceMock.commonService.getBlob).toHaveBeenCalled();
    });

    it('should upload an asset if requested', () => {
      authoringApiServiceMock.courseService.addCourseAsset.and.returnValue(of({ file: 'http://img' }));
      let formData: FormData = new FormData();
      formData.append('files[]', new File([], 'filename'));
      component['_grapesManager'].onAssetUpload('', { body: formData });

      expect(authoringApiServiceMock.courseService.addCourseAsset).toHaveBeenCalled();
    });

    it('should deliver assets if requested', () => {
      authoringApiServiceMock.courseService.getCourseAssets.and.returnValue(of([{ file: 'http://img' }]));
      let formData: FormData = new FormData();
      formData.append('files[]', new File([], 'filename'));
      component['_grapesManager'].onAssetsRequested();

      expect(authoringApiServiceMock.courseService.getCourseAssets).toHaveBeenCalled();
    });

    it('should tell the manager to save if button is clicked', done => {
      clickElement(fixture, '#btn-saveSlide');
      component['_grapesManager'].saveRequested$.subscribe(_ => {
        expect(true).toBeTrue();
        done();
      });
    });

    it('should delete the slide if button is clicked', () => {
      authoringApiServiceMock.slideService.deleteSlide.and.returnValue(of(new HttpResponse()));
      const debugElem = fixture.debugElement.query(By.css('#btn-deleteSlide'));
      debugElem.triggerEventHandler('confirm', {});
      
      expect(authoringApiServiceMock.slideService.deleteSlide).toHaveBeenCalled();
    });

    it('should enable the save button if state is dirty', () => {
      expect(getHTMLElement(fixture, '#btn-saveSlide').disabled).toBeTrue();

      component['_grapesManager'].setEditorState(EEditorState.eDirty);
      fixture.detectChanges();

      expect(getHTMLElement(fixture, '#btn-saveSlide').disabled).toBeFalse();
    });

  });

  describe('w/o slides', () => {

    beforeEach(() => {
      authoringApiServiceMock.slideService.getSlides.and.returnValue(of([]));
      component.chapterId = dummyChapter.id;
    });

    it('should show the "addSlide" modal on load if no slides present', () => {
      let modalMock = new NgbModalRefMock();
      let modalService = TestBed.inject(NgbModal);
      const modalServiceSpy = spyOn(modalService, 'open').and.returnValue(modalMock as NgbModalRef);
      modalMock.result = new Promise((resolve, _) => resolve(dummySlide));
      
      fixture.detectChanges();

      expect(modalServiceSpy).toHaveBeenCalled();
    });
  });



});
