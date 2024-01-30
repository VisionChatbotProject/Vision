import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { IQuestion, IQuestionBase } from 'src/app/core/models/question';
import { ICourse } from 'src/app/core/models/course';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { IQuestionnaire } from 'src/app/core/models/questionnaire';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-save-question-modal',
  templateUrl: './save-question-modal.component.html',
  styleUrls: ['./save-question-modal.component.scss']
})
export class SaveQuestionModalComponent {

  public static MODAL_OPTIONS: NgbModalOptions = { backdrop: 'static', centered: true, size: 'lg' };

  private _saveQuestionForm: FormGroup = this._formBuilder.group({    
    title: new FormControl('', Validators.required),
    text: new FormControl('', Validators.required)
  });      

  public get saveQuestionForm(): FormGroup { return this._saveQuestionForm; }

  public get title(): FormControl { return this._saveQuestionForm.get('title') as FormControl; }

  public get text(): FormControl { return this._saveQuestionForm.get('text') as FormControl; }

  private _question: IQuestion | null = null;
  public get question(): IQuestion | null { return this._question; }
  @Input() public set question(question: IQuestion | null) { 
    this._question = question; 
    if(this._question) { this._saveQuestionForm.patchValue(this._question!) }
  }

  private _questionnaire: IQuestionnaire | null = null;
  @Input() public set questionnaire(questionnaire: IQuestionnaire | null) { this._questionnaire = questionnaire; }

  public get activeModal(): NgbActiveModal { return this._activeModal; }

  constructor(
    private _formBuilder: FormBuilder,
    private _activeModal: NgbActiveModal,
    private _authoringApi: AuthoringApiService
  ) { }


  public saveQuestion(): void {
    // edit the existing question
    if(this._question != null) {
      const question: IQuestion = {
        ...this._question,
        title: this.title.value,
        text: this.text.value,
        asset: ''
      }

      this._authoringApi.questionService.modifyQuestion(question).pipe(take(1),).subscribe(
        question => this.activeModal.close(question),
      );
    }

    // create the new question
    else {
      const question: IQuestionBase = {
        title: this.title.value,
        questionnaire: 0,
        text: this.text.value,
        asset: '',
        resourcetype: 'ChoiceQuestion'
      }

      this._authoringApi.questionService.addQuestion(this._questionnaire!, question).pipe(take(1),).subscribe(
        question => this.activeModal.close(question),
      );
    }
  }

}
