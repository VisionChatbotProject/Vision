import { CommonModule } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { NgbAccordion, NgbAccordionModule, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TableModule } from "primeng/table";

import { FontAwesomeIconsModuleMock } from "src/testutils/built-in-mocks";
import { dummyChapters } from "src/testutils/object-mocks";
import { clickElement, getHTMLElement } from "src/testutils/utils";
import { ChapterTableComponent } from "./chapter-table.component";

describe('ChapterTableComponent', () => {
  let component: ChapterTableComponent;
  let fixture: ComponentFixture<ChapterTableComponent>;
  let router: Router;

  const createChapterBtnId: string = '#createChapterButton';
  const noChaptersDesc: string = '#noChaptersDescription';

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ChapterTableComponent],
      imports: [CommonModule, RouterTestingModule, FontAwesomeIconsModuleMock, TableModule, NgbAccordionModule],
      providers: [
        { provide: NgbModal },
        { provide: NgbAccordion },
      ]
    }).compileComponents();
  });

  describe('w/ chapters', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ChapterTableComponent);
      component = fixture.componentInstance;
      component.chapters = dummyChapters;

      router = TestBed.inject(Router);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should not show the "createChapter" button and header when there are chapters', () => {
      expect(getHTMLElement(fixture, createChapterBtnId)).toBeFalsy();
      expect(getHTMLElement(fixture, noChaptersDesc)).toBeFalsy();
    });

    it('should emit "open" with the chapterId of the chapter when "editChapter" is clicked', () => {
      const btnId = `#btn-openChapter-${dummyChapters[0].id}`;
      const openChapterSpy = spyOn(component.openChapter, 'emit');

      clickElement(fixture, btnId);
      expect(openChapterSpy).toHaveBeenCalledWith(dummyChapters[0].id);
    });

    it('should emit "delete" with the chapterId of the chapter when "editChapter" is clicked', () => {
      const btnId = `#btn-deleteChapter-${dummyChapters[0].id}`;
      const openChapterSpy = spyOn(component.deleteChapter, 'emit');

      const debugElem = fixture.debugElement.query(By.css(btnId));
      debugElem.triggerEventHandler('confirm', {});
      expect(openChapterSpy).toHaveBeenCalledWith(dummyChapters[0].id);
    });
  });

  describe('w/o chapters', () => {

    beforeEach(() => {
      fixture = TestBed.createComponent(ChapterTableComponent);
      component = fixture.componentInstance;
      router = TestBed.inject(Router);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show the "createChapter" button and header when there are no chapters', () => {
      expect(getHTMLElement(fixture, createChapterBtnId)).toBeTruthy();
      expect(getHTMLElement(fixture, noChaptersDesc)).toBeTruthy();
    });

    it('should emit "addChapter" when the "createChapter" button is clicked', () => {
      const addChapterSpy = spyOn(component.addChapter, 'emit');

      clickElement(fixture, createChapterBtnId);
      expect(addChapterSpy).toHaveBeenCalled();
    });
  });
});