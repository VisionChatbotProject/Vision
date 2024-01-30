import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { IAnswerOption, IAnswerOptionBase } from 'src/app/core/models/answer_options';
import { IQuestion } from 'src/app/core/models/question';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';

const RESOURCE_TYPE = 'AnswerOption';

@Component({
  selector: 'app-save-answer-option-modal',
  templateUrl: './save-answer-option-modal.component.html',
  styleUrls: ['./save-answer-option-modal.component.scss']
})
export class SaveAnswerOptionModalComponent {

  public static MODAL_OPTIONS: NgbModalOptions = { backdrop: 'static', centered: true, size: 'lg' };

  private _saveAnswerOptionForm: FormGroup = this._formBuilder.group({
    id: new FormControl(null, [ ]),
    text: new FormControl('', Validators.required),
    correctAnswer: new FormControl(false, Validators.required)
  });

  public get saveAnswerOptionForm(): FormGroup { return this._saveAnswerOptionForm; }

  public get text(): FormControl { return this._saveAnswerOptionForm.get('text') as FormControl; }

  private _answerOption: IAnswerOption | null = null;
  public get answerOption(): IAnswerOption | null { return this._answerOption; }
  @Input() public set answerOption(answerOption: IAnswerOption | null) {
    this._answerOption = answerOption;
    if (this._answerOption) { this._saveAnswerOptionForm.patchValue(this._answerOption!) }
  }

  private _question: IQuestion | null = null;
  @Input() public set question(question: IQuestion) { this._question = question; }

  public get activeModal(): NgbActiveModal { return this._activeModal; }

  constructor(
    private _formBuilder: FormBuilder,
    private _activeModal: NgbActiveModal,
    private _authoringApi: AuthoringApiService
  ) { }


  public saveAnswerOption(): void {
    // edit the existing answerOption
    if (this._answerOption != null) {
      const answerOption: IAnswerOption = {
        ...this._answerOption,
        text: this.text.value,
        correctAnswer: this._saveAnswerOptionForm.get('correctAnswer')!.value,
        asset: ''
      }

      this._authoringApi.answerOptionService.modifyAnswerOption(answerOption).pipe(take(1)).subscribe(
        answerOption => this.activeModal.close(answerOption),
      );
    }

    // create the new answerOption
    else {
      const answerOption: IAnswerOptionBase = {
        text: this.text.value,
        asset: '',
        correctAnswer: this._saveAnswerOptionForm.get('correctAnswer')!.value,
        resourcetype: RESOURCE_TYPE,
      }

      this._authoringApi.answerOptionService.addAnswerOption(this._question!, answerOption).pipe(take(1)).subscribe(
        answerOption => this.activeModal.close(answerOption),
      );
    }
  }

}

