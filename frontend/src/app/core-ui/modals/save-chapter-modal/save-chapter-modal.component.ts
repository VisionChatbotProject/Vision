import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { IChapter, IChapterBase } from 'src/app/core/models/chapter';
import { ICourse } from 'src/app/core/models/course';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';

@Component({
  selector: 'app-save-chapter-modal',
  templateUrl: './save-chapter-modal.component.html',
  styleUrls: ['./save-chapter-modal.component.scss']
})
export class SaveChapterModalComponent {

  public static MODAL_OPTIONS: NgbModalOptions = { backdrop: 'static', centered: true, size: 'lg' };

  private _saveChapterForm: FormGroup = this._formBuilder.group({
    title: new FormControl('', Validators.required),
    shortDescription: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    longDescription: new FormControl('', Validators.required),
  });

  public get saveChapterForm(): FormGroup { return this._saveChapterForm; }

  public get title(): FormControl { return this._saveChapterForm.get('title') as FormControl; }
  public get shortDescription(): FormControl { return this._saveChapterForm.get('shortDescription') as FormControl; }
  public get longDescription(): FormControl { return this._saveChapterForm.get('longDescription') as FormControl; }

  private _chapter: IChapter | null = null;
  public get chapter(): IChapter | null { return this._chapter; }
  @Input() public set chapter(chapter: IChapter | null) {
    this._chapter = chapter;
    if (this._chapter) { this._saveChapterForm.patchValue(this._chapter!) }
  }

  private _course: ICourse | null = null;
  @Input() public set course(course: ICourse | null) { this._course = course; }

  public get activeModal(): NgbActiveModal { return this._activeModal; }

  constructor(
    private _formBuilder: FormBuilder,
    private _activeModal: NgbActiveModal,
    private _authoringApi: AuthoringApiService
  ) { }


  public saveChapter(): void {
    // edit the existing chapter
    if (this._chapter != null) {
      const chapter: IChapter = {
        id: this._chapter.id,
        longDescription: this.longDescription.value,
        shortDescription: this.shortDescription.value,
        title: this.title.value,
        course: this._chapter.course,
        order: this._chapter.order,
      }

      this._authoringApi.chapterService.modifyChapter(chapter).subscribe(
        chapter => this.activeModal.close(chapter),
      );
    }

    // create the new chapter
    else {
      const chapter: IChapterBase = {
        longDescription: this.longDescription.value,
        shortDescription: this.shortDescription.value,
        title: this.title.value,
      }

      this._authoringApi.chapterService.addChapter(this._course!, chapter).subscribe(
        chapter => this.activeModal.close(chapter),
      );
    }
  }

}
