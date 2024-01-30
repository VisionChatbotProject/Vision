import { Component } from '@angular/core';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SaveCourseModalComponent } from 'src/app/core-ui/modals/save-course-modal/save-course-modal.component';

@Component({
  selector: 'sac-courses-overview',
  templateUrl: './courses-overview.component.html',
  styleUrls: ['./courses-overview.component.scss']
})
export class CoursesOverviewComponent  {

  constructor( 
    private _authoringApi : AuthoringApiService,
    private _modalService: NgbModal
  ) { 
    
  }

  public addCourse(): void {
    this._modalService.open(SaveCourseModalComponent, SaveCourseModalComponent.MODAL_OPTIONS).result.then(
      _ => this._authoringApi.contextService.reloadContext()
    );
  }
}
