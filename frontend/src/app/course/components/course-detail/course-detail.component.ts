import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Observable, of } from "rxjs";
import { switchMap, take, tap } from "rxjs/operators";
import { ReorderModalComponent } from "src/app/core-ui/modals/reorder-modal/reorder-modal.component";
import { SaveChapterModalComponent } from "src/app/core-ui/modals/save-chapter-modal/save-chapter-modal.component";
import { SaveCourseModalComponent } from "src/app/core-ui/modals/save-course-modal/save-course-modal.component";
import { SaveQuestionnaireModalComponent } from "src/app/core-ui/modals/save-questionnaire-modal/save-questionnaire-modal.component";
import { IChapter } from "src/app/core/models/chapter";
import { ICourse } from "src/app/core/models/course";
import { IQuestionnaire } from "src/app/core/models/questionnaire";
import { AuthoringApiService } from "src/app/core/services/authoringApi/authoring-api.service";
import { IIntent } from "src/app/intent/models/intent.model";
import { IExam } from "src/app/exam/models/exam.model";
import { ITask } from "src/app/task/models/task.model";
import { IOrganizationRole } from 'src/app/core/models/organization_role';

@Component({
  selector: "sac-course-detail",
  templateUrl: "./course-detail.component.html",
  styleUrls: ["./course-detail.component.scss"],
})
export class CourseDetailComponent implements OnInit {

  private _chapters: IChapter[] = [];
  public get chapters(): IChapter[] {
    return this._chapters;
  }

  private _chaptersLoaded$: Observable<boolean> = new Observable();
  public get chaptersLoaded$(): Observable<boolean> {
    return this._chaptersLoaded$;
  }

  private _questionnaires: IQuestionnaire[] = [];
  public get questionnaires(): IQuestionnaire[] {
    return this._questionnaires;
  }

  private _questionnairesLoaded$: Observable<boolean> = new Observable();
  public get questionnairesLoaded$(): Observable<boolean> {
    return this._questionnairesLoaded$;
  }

  private _intents$: Observable<IIntent[]> = new Observable();
  public get intents$(): Observable<IIntent[]> {
    return this._intents$;
  }

  private _exams$: Observable<IExam[]> = new Observable();
  public get exams$(): Observable<IExam[]> {
    return this._exams$;
  }

  private _tasks$: Observable<ITask[]> = new Observable();
  public get tasks$(): Observable<ITask[]> {
    return this._tasks$;
  }

  private _course: ICourse | undefined = undefined;
  public get course(): ICourse | undefined {
    return this._course;
  }

  private _trainingRequest: Boolean = false;
  public get trainingRequest(): Boolean {
    return this._trainingRequest;
  }

  private _performance: Number | undefined = undefined;
  public get performance(): Number | undefined { 
    return this._performance; 
  }

  private _canEdit: boolean = false;
  public get canEdit(): boolean { return this._canEdit; }

  constructor(
    private _authoringApi: AuthoringApiService,
    private _modalService: NgbModal,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) { 
    const selfRoleId: number = this._authoringApi.contextService.self.role;
    const selfRole: IOrganizationRole = this._authoringApi.contextService.organizationRoles.find(({ id }) => id == selfRoleId)!;
    this._canEdit = selfRole.canModifyOrganizationDetails;
  }

  public ngOnInit(): void {
    this._course = this._authoringApi.contextService.courses.find(
      (c) => c.id == this._activatedRoute.snapshot.queryParams["id"]
    );
    if (this._course) {
      this._loadChapters();
      this._loadQuestionnaires();
      this._loadIntents();
      this._loadExams();
      this._loadTasks();
      this._loadStatistics();
    }
  }

  private _dateHelper(dateString: string): string {
    if (dateString.endsWith('Z')) {
      dateString = dateString.substring(0, dateString.length - 1);
    }
    return dateString;
  }

  private _loadChapters(): void {
    this._chaptersLoaded$ = this._authoringApi.chapterService.getChapters(this._course!).pipe(
      tap((chapters) => (this._chapters = chapters)),
      switchMap((_) => of(true))
    );
  }

  private _loadQuestionnaires(): void {
    this._questionnairesLoaded$ = this._authoringApi.questionnaireService
      .getQuestionnaires(this._course!)
      .pipe(
        tap((questionnaires) => (this._questionnaires = questionnaires)),
        switchMap((_) => of(true))
      );
  }

  private _loadIntents(): void {
    this._intents$ = this._authoringApi.courseService.getIntents(this._course!);
  }

  private _loadExams(): void {
    this._exams$ = this._authoringApi.courseService.getExams(this._course!);
  }

  private _loadTasks(): void {
    this._tasks$ = this._authoringApi.courseService.getTasks(this._course!);
  }

  private _loadStatistics(): void {
    this._authoringApi.courseService.performanceCourse(this._course!).pipe(take(1)).subscribe((p: number) => this._performance = p);
  }

  public addChapter(): void {
    const modalRef: NgbModalRef = this._modalService.open(
      SaveChapterModalComponent,
      SaveChapterModalComponent.MODAL_OPTIONS
    );
    modalRef.componentInstance.course = this._course;
    modalRef.result.then((_) => (this._loadChapters()));
  }

  public editChapter(chapterId: number): void {
    const modalRef: NgbModalRef = this._modalService.open(
      SaveChapterModalComponent,
      SaveChapterModalComponent.MODAL_OPTIONS
    );
    modalRef.componentInstance.course = this._course;
    modalRef.componentInstance.chapter = this._chapters.find(
      (chapter) => chapter.id == chapterId
    );
    modalRef.result.then((_) => (this._loadChapters()));
  }

  public openChapter(chapterId: number): void {
    this._router.navigate(["../chapter-detail"], {
      relativeTo: this._activatedRoute,
      queryParams: { id: chapterId },
    });
  }

  public deleteChapter(chapterId: number): void {
    this._authoringApi.chapterService
      .deleteChapter({ id: chapterId } as IChapter)
      .pipe(
        take(1),
        tap((_) => (this._loadChapters()))
      )
      .subscribe((_) => _);
  }

  public onOpenReorderModal(): void {
    const reorderModal: NgbModalRef = this._modalService.open(ReorderModalComponent)
    reorderModal.componentInstance.labelKey = 'title';
    reorderModal.componentInstance.orderables = this._chapters;
    reorderModal.componentInstance.reorderAction = (chapter: IChapter) => this._authoringApi.chapterService.modifyChapter(chapter).pipe(
      switchMap(_ => this._authoringApi.chapterService.getChapters(this._course!)),
      tap(chapters => this._chapters = chapters)
    );

  }

  public isChapterNotAssigned(chapter: IChapter): boolean {
    return this.questionnaires.find(x => x.chapter == chapter.id) == null ? true : false;
  }

  public getAssignableChapters(x?: IQuestionnaire): IChapter[] {
    let c: IChapter = {
      title: '-',
      course: 0,
      shortDescription: "",
      longDescription: "",
      id: 0,
      order: 0
    };
    return [c].concat(this.chapters.filter(chapter => { 
      return (x != undefined && chapter.id == x.chapter) || (x == undefined && this.isChapterNotAssigned(chapter)) 
    }));
  }

  public addQuestionnaire(): void {
    const modalRef: NgbModalRef = this._modalService.open(
      SaveQuestionnaireModalComponent,
      SaveChapterModalComponent.MODAL_OPTIONS
    );
    modalRef.componentInstance.course = this._course!;
    this.chaptersLoaded$.subscribe(_ => {
      modalRef.componentInstance.chapters = this.getAssignableChapters();
    })
    modalRef.result.then(
      (_) => (this._loadQuestionnaires())
    );
  }

  public editQuestionnaire(questionnaireId: number): void {
    const modalRef: NgbModalRef = this._modalService.open(
      SaveQuestionnaireModalComponent,
      SaveChapterModalComponent.MODAL_OPTIONS
    );
    let questionnaire = this._questionnaires.find(
      (questionnaire) => questionnaire.id == questionnaireId
    );
    modalRef.componentInstance.course = this._course;
    modalRef.componentInstance.questionnaire = questionnaire;
    this.chaptersLoaded$.subscribe(_ => {
      modalRef.componentInstance.chapters = this.getAssignableChapters(questionnaire);
    })

    modalRef.result.then(
      (_) => (this._loadQuestionnaires())
    );
  }

  public openQuestionnaire(questionnaireId: number): void {
    this._router.navigate(["../questionnaire-detail"], {
      relativeTo: this._activatedRoute,
      queryParams: { id: questionnaireId },
    });
  }

  public deleteQuestionnaire(questionnaireId: number): void {
    this._authoringApi.questionnaireService
      .deleteQuestionnaire({ id: questionnaireId } as IQuestionnaire)
      .pipe(
        take(1),
        tap((_) => (this._loadQuestionnaires()))
      )
      .subscribe((_) => _);
  }

  public openCourses(): void {
    this._router.navigate(["../"], { relativeTo: this._activatedRoute });
  }

  public editCourse(): void {
    const modalRef: NgbModalRef = this._modalService.open(
      SaveCourseModalComponent,
      SaveCourseModalComponent.MODAL_OPTIONS
    );
    // original Modal code
    // modalRef.componentInstance.course = this._course!;
    let c = this._course!;
    if (c.courseBeginDate != null) {
      c.courseBeginDate = this._dateHelper(c.courseBeginDate);
    }
    if (c.courseEndDate != null) {
      c.courseEndDate = this._dateHelper(c.courseEndDate);
    }
    modalRef.componentInstance.course = c;
    modalRef.result.then((_) =>
      this._authoringApi.contextService.reloadContext()
    );
  }

  public deleteCourse(): void {
    this._authoringApi.courseService
      .deleteCourse(this._course!)
      .pipe(take(1))
      .subscribe((_) => {
        this._authoringApi.contextService.reloadContext();
        this.openCourses();
      });
  }

  public exportCourse(): void {
    this._authoringApi.courseService
      .exportCourse(this._course!)
      .pipe(take(1))
      .subscribe();
  }

  public previewCourse(): void {
    this._authoringApi.courseService.previewCourse(this._course!).pipe(take(1)).subscribe(_ => {})
  }

  public trainCourse(): void {
    this._trainingRequest = true;
    this._authoringApi.courseService.trainCourse(this._course!).pipe(take(1)).subscribe(_ => {
      this._trainingRequest = false;
    })
  }

  // ---- Intent

  public addIntent(intent: IIntent): void {
    intent.chapter = intent.chapter == 0 ? null : intent.chapter;
    this._authoringApi.courseService.addIntent(this._course!, intent).pipe(
      take(1),
      tap((_) => (this._loadIntents()))
    )
    .subscribe((_) => _);
  }

  public editIntent(intent: IIntent): void {
    intent.chapter = intent.chapter == 0 ? null : intent.chapter;
    this._authoringApi.courseService.modifyIntent(intent).pipe(
      take(1),
      tap((_) => (this._loadIntents()))
    )
    .subscribe((_) => _);
  }

  public deleteIntent(intent: IIntent): void {
    this._authoringApi.courseService.deleteIntent(intent).pipe(take(1)).subscribe(_ => this._loadIntents());
  }

  // ---- Exam

  public addExam(exam: IExam): void {
    this._authoringApi.courseService.addExam(this._course!, exam).pipe(take(1)).subscribe(_ => this._loadExams());
  }

  public editExam(exam: IExam): void {
    this._authoringApi.courseService.modifyExam(exam).pipe(take(1)).subscribe(_ => this._loadExams());
  }

  public deleteExam(exam: IExam): void {
    this._authoringApi.courseService.deleteExam(exam).pipe(take(1)).subscribe(_ => this._loadExams());
  }

  // ---- Task

  public addTask(task: ITask): void {
    this._authoringApi.courseService.addTask(this._course!, task).pipe(take(1)).subscribe(_ => this._loadTasks());
  }

  public editTask(task: ITask): void {
    this._authoringApi.courseService.modifyTask(task).pipe(take(1)).subscribe(_ => this._loadTasks());
  }

  public deleteTask(task: ITask): void {
    this._authoringApi.courseService.deleteTask(task).pipe(take(1)).subscribe(_ => this._loadTasks());
  }

}
