import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { ICourse, ICourseBase } from 'src/app/core/models/course';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { IImage } from '../../components/image-chooser/image-chooser.component';

@Component({
  selector: 'app-save-course-modal',
  templateUrl: './save-course-modal.component.html',
  styleUrls: ['./save-course-modal.component.scss'],
})
export class SaveCourseModalComponent {
  public static MODAL_OPTIONS: NgbModalOptions = {
    backdrop: 'static',
    centered: true,
    size: 'lg',
  };

  private _saveCourseForm: FormGroup = this._formBuilder.group({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
    ]),
    shortDescription: new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
    ]),
    longDescription: new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
    ]),
    teacherName: new FormControl('', Validators.maxLength(100)),
    teacherEmail: new FormControl('', Validators.email),
    materials: new FormControl('', Validators.maxLength(100)),
    ressources: new FormControl('', Validators.maxLength(100)),
    courseBeginDate: new FormControl('', Validators.maxLength(100)),
    courseEndDate: new FormControl('', Validators.maxLength(100)),
  });

  private _image: IImage = { url: '/assets/img/dummy.png', data: new Blob() };
  public get image(): IImage {
    return this._image;
  }
  public set image(i: IImage) {
    this._image = i;
  }

  public get saveCourseForm(): FormGroup {
    return this._saveCourseForm;
  }

  public get name(): FormControl {
    return this._saveCourseForm.get('name') as FormControl;
  }
  public get shortDescription(): FormControl {
    return this._saveCourseForm.get('shortDescription') as FormControl;
  }
  public get longDescription(): FormControl {
    return this._saveCourseForm.get('longDescription') as FormControl;
  }
  public get teacherName(): FormControl {
    return this._saveCourseForm.get('teacherName') as FormControl;
  }
  public get teacherEmail(): FormControl {
    return this._saveCourseForm.get('teacherEmail') as FormControl;
  }
  public get courseBeginDate(): FormControl {
    return this._saveCourseForm.get('courseBeginDate') as FormControl;
  }
  public get courseEndDate(): FormControl {
    return this._saveCourseForm.get('courseEndDate') as FormControl;
  }
  public get materials(): FormControl {
    return this._saveCourseForm.get('materials') as FormControl;
  }
  public get ressources(): FormControl {
    return this._saveCourseForm.get('ressources') as FormControl;
  }

  private _course: ICourse | null = null;
  public get course(): ICourse | null {
    return this._course;
  }
  @Input() public set course(course: ICourse | null) {
    this._course = course;
    if (this._course) {
      this._saveCourseForm.patchValue(this._course!);
      this.image = { url: this._course.image as string, data: new Blob() };
    }
  }

  public get activeModal(): NgbActiveModal {
    return this._activeModal;
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _activeModal: NgbActiveModal,
    private _authoringApi: AuthoringApiService
  ) { }

  public saveCourse(): void {
    // edit the existing course
    if (this._course != null) {
      const course: ICourse = {
        id: this._course.id,
        image: this._image.data.size ? this._image.data : this._course.image,
        longDescription: this.longDescription.value,
        shortDescription: this.shortDescription.value,
        name: this.name.value,
        teacherName: this.teacherName.value,
        teacherEmail: this.teacherEmail.value,
        courseBeginDate: this.courseBeginDate.value,
        courseEndDate: this.courseEndDate.value,
        ressources: this.ressources.value,
        materials: this.materials.value,
      };

      this._authoringApi.courseService
        .modifyCourse(course)
        .pipe(take(1))
        .subscribe((_) => this.activeModal.close(course));
    }

    // create the new course
    else {
      const course: ICourseBase = {
        image: this._image.data.size ? this._image.data : '',
        longDescription: this.longDescription.value,
        shortDescription: this.shortDescription.value,
        name: this.name.value,
        teacherName: this.teacherName.value,
        teacherEmail: this.teacherEmail.value,
        courseBeginDate: this.courseBeginDate.value,
        courseEndDate: this.courseEndDate.value,
        ressources: this.ressources.value,
        materials: this.materials.value,
      };

      this._authoringApi.courseService
        .addCourse(this._authoringApi.contextService.activeOrganization, course)
        .pipe(take(1))
        .subscribe((_) => this.activeModal.close(course));
    }
  }
}
