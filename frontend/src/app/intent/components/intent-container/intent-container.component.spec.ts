import { CommonModule } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgbAccordionModule, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeIconsModuleMock } from 'src/testutils/built-in-mocks';
import { IntentTableComponentMock, NgbModalRefMock } from 'src/testutils/component-mocks';
import { dummyChapter, dummyChapters, dummyIntents } from 'src/testutils/object-mocks';
import { clickElement, getHTMLElement } from 'src/testutils/utils';

import { IntentContainerComponent } from './intent-container.component';
import { IChapter } from 'src/app/core/models/chapter';

describe('IntentContainerComponent', () => {
  let component: IntentContainerComponent;
  let fixture: ComponentFixture<IntentContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntentContainerComponent, IntentTableComponentMock ],
      imports: [CommonModule, FontAwesomeIconsModuleMock, NgbAccordionModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntentContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a container message if no intents are set', () => {
    component.intents = dummyIntents;
    fixture.detectChanges();

    expect(getHTMLElement(fixture, 'noIntentsContainer')).toBeDefined()
  });

  it('should display intents set via input', () => {
    component.intents = dummyIntents;
    fixture.detectChanges();

    expect(getHTMLElement(fixture, 'noIntentsContainer')).toBe(null)
  });

  it('should open a modal for adding intents and emit an event', fakeAsync(() => {
    let modalMock = new NgbModalRefMock();
    let modalService = TestBed.inject(NgbModal);
    const modalServiceSpy = spyOn(modalService, 'open').and.returnValue(modalMock as NgbModalRef);
    const addIntentSpy = spyOn(component.addIntent, 'emit');
    // const chaptersSpy = spyOn(modalMock.componentInstance.chapters, );
    
    modalMock.result = new Promise((resolve, _) => resolve(dummyIntents[0]));
    

    clickElement(fixture, '#addIntentButton');
    tick();

    expect(modalServiceSpy).toHaveBeenCalled();
    expect(addIntentSpy).toHaveBeenCalledWith(dummyIntents[0]);
    expect(addIntentSpy).toHaveBeenCalledWith(dummyIntents[0]);
  }));

  it('should open a modal for modifying intents and emit an event', fakeAsync(() => {
    let modalMock = new NgbModalRefMock();
    let modalService = TestBed.inject(NgbModal);
    const modalServiceSpy = spyOn(modalService, 'open').and.returnValue(modalMock as NgbModalRef);
    const modifyIntentSpy = spyOn(component.editIntent, 'emit');
    
    modalMock.result = new Promise((resolve, _) => resolve(dummyIntents[0]));

    component.modifyIntent(dummyIntents[0]);
    tick();

    expect(modalServiceSpy).toHaveBeenCalled();
    expect(modifyIntentSpy).toHaveBeenCalledWith(dummyIntents[0]);
  }));

  it('should emit an event if an intent is to be deleted', fakeAsync(() => {
    const deleteIntentSpy = spyOn(component.deleteIntent, 'emit').and.callThrough();
    
    component.onDeleteIntent(dummyIntents[0]);
    tick();

    expect(deleteIntentSpy).toHaveBeenCalledWith(dummyIntents[0]);
  }));

  it('should have no chapter assigned', () => {
    component.intents = dummyIntents;
    let result = component.isChapterNotAssigned(dummyChapter);
    expect(result).toEqual(true);
  });

  it('should have chapter assigned', () => {
    dummyIntents[0].chapter = dummyChapter.id;
    component.intents = dummyIntents;
    let result = component.isChapterNotAssigned(dummyChapter);
    expect(result).toEqual(false);
    dummyIntents[0].chapter = null;
  });

  it('should have all chapters assignable', () => {
    component.intents = dummyIntents;
    component.chapters = dummyChapters;
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
    expect(result.length).toEqual(chapters.length);
  });

  it('should have one not assignable chapters', () => {
    dummyIntents[0].chapter = dummyChapter.id;
    component.intents = dummyIntents;
    component.chapters = dummyChapters;
    let result = component.getAssignableChapters(dummyIntents[0]);
    let c: IChapter = {
      title: '-',
      course: 0,
      shortDescription: "",
      longDescription: "",
      id: 0,
      order: 0
    };
    let chapters = [c].concat(dummyChapters);
    expect(result.length).toEqual(chapters.length-1);
    dummyIntents[0].chapter = null;
  });

});
