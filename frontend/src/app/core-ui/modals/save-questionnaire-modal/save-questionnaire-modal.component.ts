import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { IQuestionnaire, IQuestionnaireBase } from 'src/app/core/models/questionnaire';
import { ICourse } from 'src/app/core/models/course';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { IChapter } from 'src/app/core/models/chapter';

@Component({
  selector: 'app-save-questionnaire-modal',
  templateUrl: './save-questionnaire-modal.component.html',
  styleUrls: ['./save-questionnaire-modal.component.scss']
})
export class SaveQuestionnaireModalComponent{

  public static MODAL_OPTIONS: NgbModalOptions = { backdrop: 'static', centered: true, size: 'lg' };

  private _saveQuestionnaireForm: FormGroup = this._formBuilder.group({    
    title: new FormControl('', Validators.required),
    chapter: new FormControl('')
  });      

  public get saveQuestionnaireForm(): FormGroup { return this._saveQuestionnaireForm; }

  public get title(): FormControl { return this._saveQuestionnaireForm.get('title') as FormControl; }
  public get chapter(): FormControl { return this._saveQuestionnaireForm.get('chapter') as FormControl; }

  private _questionnaire: IQuestionnaire | null = null;
  public get questionnaire(): IQuestionnaire | null { return this._questionnaire; }
  @Input() public set questionnaire(questionnaire: IQuestionnaire | null) { 
    this._questionnaire = questionnaire; 
    if(this._questionnaire) { this._saveQuestionnaireForm.patchValue(this._questionnaire!) }
  }

  private _course: ICourse | null = null;
  @Input() public set course(course: ICourse | null) { this._course = course; }

  public get activeModal(): NgbActiveModal { return this._activeModal; }

  @Input() public set chapters(chapters: IChapter[] | null) { this._chapters = chapters; }
  private _chapters: IChapter[] | null = null;
  public get chapters() {
    return this._chapters;
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _activeModal: NgbActiveModal,
    private _authoringApi: AuthoringApiService
  ) { 

  }

  public saveQuestionnaire(): void {
    let chapter = this.chapter.value == 0 ? null : this.chapter.value;

    
    // edit the existing questionnaire
    if(this._questionnaire != null) {
      const questionnaire: IQuestionnaire = {
        id: this._questionnaire.id,
        title: this.title.value,
        course: this._questionnaire.course,
        chapter: chapter
      }

      

      this._authoringApi.questionnaireService.modifyQuestionnaire(questionnaire).subscribe(
        questionnaire => this.activeModal.close(questionnaire),
      );
    }

    // create the new questionnaire
    else {
      const questionnaire: IQuestionnaireBase = {
        title: this.title.value,
        chapter: chapter
      }

      this._authoringApi.questionnaireService.addQuestionnaire(this._course!, questionnaire).subscribe(
        questionnaire => this.activeModal.close(questionnaire),
      );
    }
  }

}
