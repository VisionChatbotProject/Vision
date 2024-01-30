import { Component, OnInit } from '@angular/core';
import { ICourse } from 'src/app/core/models/course';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';

@Component({
  selector: 'dab-recently-edited-courses',
  templateUrl: './recently-edited-courses.component.html',
  styleUrls: ['./recently-edited-courses.component.scss']
})
export class RecentlyEditedCoursesComponent {

  private _courses: ICourse[] = this._authoringApi.contextService.courses.sort((l, r) => <any>r.modifiedAt! - <any>l.modifiedAt! )
  public get courses(): ICourse[] { return this._courses; }
  
  constructor(
    private _authoringApi : AuthoringApiService
  ) {}
}
