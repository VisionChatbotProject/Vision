import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { IIntent } from '../../models/intent.model';
import { IChapter } from 'src/app/core/models/chapter';

@Component({
  selector: 'app-save-intent',
  templateUrl: './save-intent.component.html',
  styleUrls: ['./save-intent.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaveIntentComponent {
  public static MODAL_OPTIONS: NgbModalOptions = {
    backdrop: 'static',
    centered: true,
    size: 'lg',
  };

  @Input() public set intent(i: IIntent) { 
    this._intentForm.patchValue(i); 
    this.intents.clear();
    i.intents.forEach(intent => {
      this.addIntentItem(intent);
    })
  }
  

  private _intentForm = this._fb.group({
    id: new FormControl(-1),
    name: new FormControl('', [Validators.required]),
    response: new FormControl('', [Validators.required]),
    intents: new FormArray([new FormControl('', [Validators.required])], [Validators.required]),
    isQuestion: new FormControl(false, []),
    chapter: new FormControl('')
  });

  public get intentForm(): FormGroup { return this._intentForm; }
  public get idIsValid(): boolean { return this._intentForm.get('id')!.value > 0; }

  public get name(): FormControl { return this._intentForm.get('name') as FormControl; }
  public get response(): FormControl { return this._intentForm.get('response') as FormControl; }
  public get intents(): FormArray { return this._intentForm.get('intents') as FormArray; }
  public get chapter(): FormControl { return this._intentForm.get('chapter') as FormControl; }


  public get activeModal(): NgbActiveModal { return this._activeModal; }

  @Input() public set chapters(chapters: IChapter[] | null) { this._chapters = chapters; }
  private _chapters: IChapter[] | null = null;
  public get chapters() {
    return this._chapters;
  }

  constructor(
    private _activeModal: NgbActiveModal,
    private _fb: FormBuilder
  ) { }

  public saveIntent(): void {
    this._activeModal.close(this._intentForm.value)
  }

  public addIntentItem(content: string = ''): void {
    this.intents.push(new FormControl(content, [Validators.required]));
  }

  public removeIntentItem(i: number): void {
    this.intents.removeAt(i);
  }

}
