import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { IExam } from '../../models/exam.model';

@Component({
  selector: 'app-save-exam',
  templateUrl: './save-exam.component.html',
  styleUrls: ['./save-exam.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaveExamComponent implements OnInit {
  public static MODAL_OPTIONS: NgbModalOptions = {
    backdrop: 'static',
    centered: true,
    size: 'lg',
  };

  @Input() public set exam(exam: IExam) { 
    this._examForm.patchValue(exam); 
  }

  private _examForm = this._fb.group({
    id: new FormControl(-1),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.maxLength(255)]),
    observation: new FormControl('', [Validators.maxLength(255)]),
    date: new FormControl('', [      
      Validators.required
    ]),
    isActive: new FormControl(false, [])
  });

  public get examForm(): FormGroup { return this._examForm; }
  public get idIsValid(): boolean { return this._examForm.get('id')!.value > 0; }

  public get name(): FormControl { return this._examForm.get('name') as FormControl; }
  public get description(): FormControl { return this._examForm.get('description') as FormControl; }
  public get observation(): FormControl { return this._examForm.get('observation') as FormControl; }
  
  public get activeModal(): NgbActiveModal { return this._activeModal; }


  constructor(
    private _activeModal: NgbActiveModal,
    private _fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  public saveExam(): void {
    this._activeModal.close(this._examForm.value)
  }
}
