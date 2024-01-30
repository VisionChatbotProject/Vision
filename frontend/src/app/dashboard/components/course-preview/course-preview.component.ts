import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ICourse } from 'src/app/core/models/course';

@Component({
  selector: 'dab-course-preview',
  templateUrl: './course-preview.component.html',
  styleUrls: ['./course-preview.component.scss']
})
export class CoursePreviewComponent {

  private _course : ICourse | null = null;
  public get course() : ICourse | null { return this._course; }
  @Input() public set course(c : ICourse | null) { this._course = c; }

  constructor(
    private _router : Router,
  ) { }

  public openCourse() : void {
    this._router.navigate(['main/courses/course'], { queryParams : { 'id' : this._course!.id } });
  }

}
