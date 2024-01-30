import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { tap, switchMap, take } from 'rxjs/operators';
import { ReorderModalComponent } from 'src/app/core-ui/modals/reorder-modal/reorder-modal.component';
import { ICourse } from 'src/app/core/models/course';
import { IChapter } from 'src/app/core/models/chapter';
import { ISlide } from 'src/app/core/models/slide';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SaveSlideModalComponent } from 'src/app/core-ui/modals/save-slide-modal/save-slide-modal.component';
import { SaveChapterModalComponent } from 'src/app/core-ui/modals/save-chapter-modal/save-chapter-modal.component';

@Component({
  selector: 'sac-chapter-detail',
  templateUrl: './chapter-detail.component.html',
  styleUrls: ['./chapter-detail.component.scss']
})
export class ChapterDetailComponent implements OnInit {

  private _chapterLoaded$: Observable<boolean> = new Observable();
  public get chapterLoaded$(): Observable<boolean> { return this._chapterLoaded$; }

  private _chapter: IChapter | undefined = undefined;
  public get chapter(): IChapter | undefined { return this._chapter; }

  private _course: ICourse  | undefined = undefined;
  
  private _slides: ISlide[] = [];
  public get slides(): ISlide[] { return this._slides; }

  private _performance: Number | undefined = undefined;
  public get performance(): Number | undefined { return this._performance; }

  constructor(
    private _authoringApi: AuthoringApiService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this._chapterLoaded$ = this._loadChapter();
  }

  private _loadChapter(): Observable<boolean> {
    return this._authoringApi.chapterService.getChapter(this._activatedRoute.snapshot.queryParams['id']).pipe(
      tap(chapter => this._chapter = chapter),
      switchMap(_ => this._authoringApi.slideService.getSlides(this._chapter!)),
      tap(slides => this._slides = slides),
      switchMap(_ => this._authoringApi.courseService.getCourse(this._chapter!.course)),
      tap(course => this._course = course),
      switchMap(_ => this._authoringApi.chapterService.performanceChapter(this._chapter!)),
      tap(performance => this._performance = performance),
      switchMap(_ => of(true))
    );
  }

  public onOpenReorderModal(): void {
    const reorderModal: NgbModalRef = this._modalService.open(ReorderModalComponent);
    reorderModal.componentInstance.labelKey = 'title';
    reorderModal.componentInstance.orderables = this._slides;
    reorderModal.componentInstance.reorderAction = (slide: ISlide) =>
      this._authoringApi.slideService.modifySlide(slide).pipe(
        switchMap(_ => this._authoringApi.slideService.getSlides(this.chapter!)),
        tap(slides => this._slides = slides)
      );
  }

  public addSlide(): void {
    this._showAddSlideModal().pipe(take(1)).subscribe(() => this._chapterLoaded$ = this._loadChapter());
  }

  public editSlide(slideId: number): void {
    const modalRef: NgbModalRef = this._modalService.open(SaveSlideModalComponent, SaveSlideModalComponent.MODAL_OPTIONS);
    modalRef.componentInstance.chapter = this._chapter;
    modalRef.componentInstance.slide = this._slides.find(slide => slide.id == slideId);
    modalRef.result.then(
      _ => this._chapterLoaded$ = this._loadChapter()
    );
  }

  public openSlide(slideId: number): void {
    this._router.navigate(['../chapter'], {
      relativeTo: this._activatedRoute,
      queryParams: {
        'id': this._activatedRoute.snapshot.queryParams['id'],
        'slideId': slideId
      },
      queryParamsHandling: 'merge'
    });
  }

  public deleteSlide(slideId: number): void {
    this._authoringApi.slideService.deleteSlide({"id": slideId} as ISlide)
    .pipe(
      take(1),
      tap(_ => this._chapterLoaded$ = this._loadChapter())
    ).subscribe(_ => _);
  }

  public openCourse(): void {
    this._router.navigate(['../course'], { relativeTo: this._activatedRoute, queryParams: { 'id': this._course!.id } });
  }

  public editChapter(): void {
    const modalRef: NgbModalRef = this._modalService.open(SaveChapterModalComponent, SaveChapterModalComponent.MODAL_OPTIONS);
    modalRef.componentInstance.course = this._course!;
    modalRef.componentInstance.chapter = this._chapter!;
    modalRef.result.then(
      _ => this._chapterLoaded$ = this._loadChapter()
    );
  }

  public deleteChapter(): void {
    this._authoringApi.chapterService.deleteChapter(this._chapter!).pipe(
      take(1),
    ).subscribe(_ => {
      this.openCourse();
    });
  }

  private _showAddSlideModal(): Observable<ISlide> {
    const modalRef: NgbModalRef = this._modalService.open(SaveSlideModalComponent, SaveSlideModalComponent.MODAL_OPTIONS);
    modalRef.componentInstance.chapter = this._chapter;
    return from(modalRef.result.then());
  }
}