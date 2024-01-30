import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SaveCourseModalComponent } from 'src/app/core-ui/modals/save-course-modal/save-course-modal.component';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';

interface TableData {
  name: string,
  shortDescription: string,
  image: string,
  lastModified: Date,
  id: number,
}

@Component({
  selector: 'sac-course-table',
  templateUrl: './course-table.component.html',
  styleUrls: ['./course-table.component.scss']
})
export class CourseTableComponent implements OnInit {

  private _tableData: TableData[] = []
  public get tableData(): TableData[] { return this._tableData; }

  constructor(
    private _authoringApi: AuthoringApiService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this._tableData = this._loadCourses();
  }

  public openCourse(courseId: number) : void {
    this._router.navigate(['course'], { relativeTo: this._activatedRoute, queryParams : { 'id' : courseId } });
  }

  public addCourse(): void {
    this._modalService.open(SaveCourseModalComponent, SaveCourseModalComponent.MODAL_OPTIONS).result.then(
      _ => this._authoringApi.contextService.reloadContext()
    );
  }

  private _loadCourses(): TableData[] {
    return this._authoringApi.contextService.courses.map(c => { 
      return { id: c.id, name: c.name, shortDescription: c.shortDescription, image: c.image as string, lastModified: c.modifiedAt! }
    });
  }
}
