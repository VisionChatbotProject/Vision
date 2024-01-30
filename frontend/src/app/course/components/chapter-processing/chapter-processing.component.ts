import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { from, Observable, of } from 'rxjs';
import { map, switchMap, take, tap, toArray } from 'rxjs/operators';
import { SaveSlideModalComponent } from 'src/app/core-ui/modals/save-slide-modal/save-slide-modal.component';
import { IChapter } from 'src/app/core/models/chapter';
import { ICourse } from 'src/app/core/models/course';
import { ISlide } from 'src/app/core/models/slide';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { EEditorState } from 'src/app/grapesjs/interfaces/common.interface';
import { GrapesManagerService } from 'src/app/grapesjs/services/grapes-manager/grapes-manager.service';

@Component({
  selector: 'sac-chapter-processing',
  templateUrl: './chapter-processing.component.html',
  styleUrls: ['./chapter-processing.component.scss'],
  providers: [GrapesManagerService]
})
export class ChapterProcessingComponent implements OnInit {
  public EEditorState = EEditorState;

  /**
   * Input for setting the chapter id
   * If not set (or set to -1) the component will be in 'add' mode.
   * 
   * @param id chapter Id
   */
  @Input() public set chapterId(id: number) { this._slidesLoaded$ = this._loadSlides(id); }

  private _chapter: IChapter | null = null;
  private _course: ICourse | null = null;

  private _slidesLoaded$: Observable<boolean> = new Observable;
  public get slidesLoaded$(): Observable<boolean> { return this._slidesLoaded$; }

  private _editorState: EEditorState = EEditorState.eClean;
  public get editorState(): EEditorState { return this._editorState; }
  
  private _editorState$: Observable<EEditorState> = this._grapesManager.editorStateChanged$.pipe(tap(state => this._editorState = state));
  public get editorState$(): Observable<EEditorState> { return this._editorState$; }

  private _slides: ISlide[] = [];
  public get slides(): ISlide[] { return this._slides; }

  private _selectedSlide: ISlide | null = null;
  public get selectedSlide(): ISlide | null { return this._selectedSlide; }
  public set selectedSlide(s: ISlide | null) {
    this._selectedSlide = s;

    this._grapesManager.setEditorContext({});
    this._grapesManager.onAssetUpload = this._onAssetUpload.bind(this);

    this._router.navigate(
      [],
      {
        relativeTo: this._activatedRoute,
        queryParams: { 'slideId': s?.id },
        queryParamsHandling: 'merge',
      }
    );
  }

  constructor(
    private _authoringApi: AuthoringApiService,
    private _modalService: NgbModal,
    private _grapesManager: GrapesManagerService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {
    this._grapesManager.onLoad = this._onLoad.bind(this);
    this._grapesManager.onStore = this._onStore.bind(this);
    this._grapesManager.onAssetsRequested = this._onAssetsRequested.bind(this);
  }

  ngOnInit(): void {
    let slideIdStr : string | null = this._activatedRoute.snapshot.queryParamMap.get('slideId');
    if(slideIdStr) {
      if(!isNaN(+slideIdStr)) {
        this._selectedSlide = { id: +slideIdStr } as ISlide;
      }
    }
  }

  public addSlide(): void {

    this._showAddSlideModal().pipe().subscribe(
      (slide: ISlide) => {
        console.log(slide);
        this._selectedSlide = { id: +slide.id } as ISlide;
        this._slidesLoaded$ = this._loadSlides(this._chapter!.id)
      }
    );

  }

  public saveSlide(): void {
    this._grapesManager.requestSave();
  }

  public deleteSlide(): void {
    this._authoringApi.slideService.deleteSlide(this._selectedSlide!).pipe(take(1)).subscribe(_ => this.chapterId = this._chapter!.id);
  }

  private _showAddSlideModal(): Observable<ISlide> {
    const modalRef: NgbModalRef = this._modalService.open(SaveSlideModalComponent, SaveSlideModalComponent.MODAL_OPTIONS);
    modalRef.componentInstance.chapter = this._chapter;
    return from(modalRef.result.then());
  }

  private _loadSlides(chapterId: number): Observable<boolean> {
    return this._authoringApi.chapterService.getChapter(chapterId).pipe(
      tap(chapter => this._chapter = chapter),
      switchMap(() => this._authoringApi.courseService.getCourse(this._chapter!.course)),
      tap(course => this._course = course),
      switchMap(_ => this._authoringApi.slideService.getSlides(this._chapter!)),
      tap(slides => this._slides = slides),
      switchMap(slides => {
        if(slides.length == 0) { return this._showAddSlideModal(); }
        else { return of(slides.find(s => s.id == this._selectedSlide?.id) ?? slides[slides.length - 1]); }
      }),
      switchMap(slide =>{
        this.selectedSlide = slide;
        return of(true);
      }), 
    );
  }

  private _onLoad(keys: any, successCallback: (result: any) => any, errorCallback: (error: any) => any): void {
    this._authoringApi.commonService.getBlob(this._selectedSlide!.content).pipe(
      take(1),
      switchMap(blob => from(blob.text()))
    ).subscribe(text => {
      const data = JSON.parse(text);
      successCallback(data);
    }, error => errorCallback(error));
  }

  private _onStore(data: any, successCallback: (result: any) => any, errorCallback: (error: any) => any): void {
    const str = JSON.stringify(data);
    const bytes = new TextEncoder().encode(str);
    this._authoringApi.slideService.updateSlideContent(this._selectedSlide!, { file: new Blob([bytes], {type: "text/json;charset=utf-8"}) }).subscribe(
      () => { successCallback(true) },
      error => errorCallback(error)
    );
  }

  private _onAssetUpload(url: string, options: any): Promise<any> {
    const data: FormData = options.body;
    const file: File = data.get('files[]') as File; //yes, it has to be this shitty because grapes already sends form data
    return this._authoringApi.courseService.addCourseAsset(this._course!, { file: file }).pipe(
      map(response => { return { data: [response.file] }}),
    ).toPromise();
  }

  private _onAssetsRequested(): Promise<any> {
    return this._authoringApi.courseService.getCourseAssets(this._course!).pipe(
      switchMap(assets => from(assets)),
      map(asset => { return { src: asset.file } }),
      toArray(),
    ).toPromise()
  }
  
  public openChapterDetails(): void {
    this._router.navigate(['../chapter-detail'], { relativeTo: this._activatedRoute, queryParams: { 'id': this._chapter!.id } });
  }
}
