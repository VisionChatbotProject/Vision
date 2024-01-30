import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ITask } from '../../models/task.model';

@Component({
  selector: 'app-save-task',
  templateUrl: './save-task.component.html',
  styleUrls: ['./save-task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaveTaskComponent implements OnInit {
  public static MODAL_OPTIONS: NgbModalOptions = {
    backdrop: 'static',
    centered: true,
    size: 'lg',
  };

  @Input() public set task(task: ITask) { 
    this._taskForm.patchValue(task); 
  }

  private _taskForm = this._fb.group({
    id: new FormControl(-1),
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.maxLength(255)]),
    resources: new FormControl('', [Validators.maxLength(255)]),
    deadline: new FormControl('', [      
      Validators.required
    ]),
    isActive: new FormControl(false, [])
  });

  public get taskForm(): FormGroup { return this._taskForm; }
  public get idIsValid(): boolean { return this._taskForm.get('id')!.value > 0; }

  public get title(): FormControl { return this._taskForm.get('title') as FormControl; }
  public get description(): FormControl { return this._taskForm.get('description') as FormControl; }
  public get resources(): FormControl { return this._taskForm.get('resources') as FormControl; }
  
  public get activeModal(): NgbActiveModal { return this._activeModal; }


  constructor(
    private _activeModal: NgbActiveModal,
    private _fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  public saveTask(): void {
    this._activeModal.close(this._taskForm.value)
  }
}
