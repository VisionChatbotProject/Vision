import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { IChapter } from 'src/app/core/models/chapter';
import { ISlide, ISlideBase } from 'src/app/core/models/slide';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';

@Component({
  selector: 'app-save-slide-modal',
  templateUrl: './save-slide-modal.component.html',
  styleUrls: ['./save-slide-modal.component.scss']
})
export class SaveSlideModalComponent {

  public static MODAL_OPTIONS: NgbModalOptions = { backdrop: 'static', centered: true, size: 'sm' };

  private _saveSlideForm: FormGroup = this._formBuilder.group({
    title: new FormControl('', Validators.required),
  });

  public get saveSlideForm(): FormGroup { return this._saveSlideForm; }

  public get title(): FormControl { return this._saveSlideForm.get('title') as FormControl; }

  private _slide: ISlide | null = null;
  public get slide(): ISlide | null { return this._slide; }
  @Input() public set slide(slide: ISlide | null) { 
    this._slide = slide; 
    if(this._slide) { this._saveSlideForm.patchValue(this._slide!) }
  }

  private _chapter: IChapter | null = null;
  @Input() public set chapter(chapter: IChapter | null) { this._chapter = chapter;  }

  public get activeModal(): NgbActiveModal { return this._activeModal; }

  constructor(
    private _formBuilder: FormBuilder,
    private _activeModal: NgbActiveModal,
    private _authoringApi: AuthoringApiService
  ) { }


  public saveSlide(): void {
    // edit the existing slide
    if(this._slide != null) {
      const slide: ISlide = {
        id: this._slide.id,
        title: this.title.value,
        content: this._slide.content,
        order: this._slide.order
      }

      this._authoringApi.slideService.modifySlide(slide).subscribe(
        slide => this.activeModal.close(slide),
      );
    }

    // create the new slide
    else {
      const slide: ISlideBase = { title: this.title.value, content: '' }
      this._authoringApi.slideService.addSlide(this._chapter!, slide).subscribe(
        slide => this.activeModal.close(slide),
      );
    }
  }

}
