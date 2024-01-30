import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SaveIntentComponent } from '../../modals/save-intent/save-intent.component';
import { IIntent } from '../../models/intent.model';
import { IChapter } from 'src/app/core/models/chapter';

@Component({
  selector: 'int-intent-container',
  templateUrl: './intent-container.component.html',
  styleUrls: ['./intent-container.component.scss']
})
export class IntentContainerComponent {

  private _intents: IIntent[] = [];
  @Input() public set intents(i: IIntent[]) { this._intents = i; }
  public get intents(): IIntent[] { return this._intents; }
  
  private _chapters: IChapter[] = [];
  @Input() public set chapters(i: IChapter[]) { 
    this._chapters = i; 
  }
  public get chapters(): IChapter[] { return this._chapters; }

  @Output() public addIntent: EventEmitter<IIntent> = new EventEmitter();
  @Output() public editIntent: EventEmitter<IIntent> = new EventEmitter();
  @Output() public deleteIntent: EventEmitter<IIntent> = new EventEmitter();

  constructor(
    private _ngbModal: NgbModal
  ) { }

  public isChapterNotAssigned(chapter: IChapter): boolean {
    return this.intents.find(intent => intent.chapter == chapter.id) == null ? true : false;
  }

  public getAssignableChapters(intent?: IIntent): IChapter[] {
    let c: IChapter = {
      title: '-',
      course: 0,
      shortDescription: "",
      longDescription: "",
      id: 0,
      order: 0
    };
    return [c].concat(this.chapters.filter(chapter => { 
      return (intent != undefined && chapter.id == intent.chapter) || (intent == undefined && this.isChapterNotAssigned(chapter))
    }));
  }

  public createIntent(): void {
    const modal: NgbModalRef = this._ngbModal.open(SaveIntentComponent, SaveIntentComponent.MODAL_OPTIONS);
    modal.componentInstance.chapters = this.getAssignableChapters();
    modal.result.then(intent => this.onAddIntent(intent));
  }

  public modifyIntent(intent: IIntent): void {
    const modal: NgbModalRef = this._ngbModal.open(SaveIntentComponent, SaveIntentComponent.MODAL_OPTIONS);
    modal.componentInstance.intent = intent;
    modal.componentInstance.chapters = this.getAssignableChapters(intent);
    modal.result.then(intent => this.onEditIntent(intent));
  }

  public onAddIntent(intent: IIntent): void {
    this.addIntent.emit(intent);
  }

  public onEditIntent(intent: IIntent): void {
    this.editIntent.emit(intent);
  }

  public onDeleteIntent(intent: IIntent): void {
    this.deleteIntent.emit(intent);
  }
}
