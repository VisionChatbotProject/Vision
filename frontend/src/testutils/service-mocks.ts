import { Observable, of, ReplaySubject } from "rxjs";
import { ChapterService } from "src/app/core/services/chapter/chapter.service";
import { CommonService } from "src/app/core/services/common/common.service";
import { ContextService } from "src/app/core/services/context/context.service";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { CourseService } from "src/app/core/services/course/course.service";
import { InviteService } from "src/app/core/services/intive/invite.service";
import { OrganizationService } from "src/app/core/services/organization/organization.service";
import { OrganizationMembershipService } from "src/app/core/services/organization-membership/organization-membership.service";
import { OrganizationRoleService } from "src/app/core/services/organization-role/organization-role.service";
import { QuestionnaireService } from "src/app/core/services/questionnaire/questionnaire.service";
import { SlideService } from "src/app/core/services/slide/slide.service";
import { EVisibilityStatus } from "src/app/navigation/services/visibility-manager.service";
import { QuestionService } from "src/app/core/services/question/question.service";
import { AnswerOptionService } from "src/app/core/services/answer-option/answer-option.service";
import { ToastService } from "src/app/core/services/toast/toast.service";

export const messageServiceMock = jasmine.createSpyObj('MessageService', ['showMessage']);

export const authServiceMock = jasmine.createSpyObj('authService',
  ['login', 'logout', 'signup', 'redeem', 'confirmEmail', 'requestPasswordReset', 'confirmPasswordReset']);
export const courseServiceMock = jasmine.createSpyObj('courseService', ['getCourse', 'getCourses', 'addCourse', 'modifyCourse', 'deleteCourse', 'addCourseAsset', 'getCourseAssets', 'getExams', 'addExam', 'modifyExam', 'deleteExam', 'getTasks', 'addTask', 'modifyTask', 'deleteTask', 'getIntents', 'addIntent', 'modifyIntent', 'deleteIntent', 'performanceCourse', 'exportCourse', 'previewCourse', 'trainCourse']);
export const chapterServiceMock = jasmine.createSpyObj('chapterService', ['getChapter', 'getChapters', 'addChapter', 'modifyChapter', 'deleteChapter', 'performanceChapter']);
export const slideServiceMock = jasmine.createSpyObj('slideService', ['getSlide', 'getSlides', 'addSlide', 'modifySlide', 'updateSlideContent', 'deleteSlide']);
export const organizationServiceMock = jasmine.createSpyObj('organizationService', ['getOrganizations', 'addOrganization', 'modifyOrganization']);
export const organizationMembershipServiceMock = jasmine.createSpyObj('organizationMembershipService', ['getOrganizationMemberships', 'getSelfMembership', 'addOrganizationMembership', 'modifyOrganizationMembership', 'deleteOrganizationMembership']);
export const organizationRoleServiceMock = jasmine.createSpyObj('organizationRoleService', ['getOrganizationRoles', 'addOrganizationRole', 'modifyOrganizationRole', 'deleteOrganizationRole']);
export const contextServiceMock = jasmine.createSpyObj('contextService', ['clearOrganization', 'reloadContext'], { organizationRoles: [], activeOrganization: null, activeOrganization$: null, courses: [], organizationMemberships: [], self: null, selectedOrganizationKey: 'selectedOrg' });
export const commonServiceMock = jasmine.createSpyObj('commonService', { 'getBlob': of(new Blob()) });
export const questionnaireServiceMock = jasmine.createSpyObj('questionnaireService', ['getQuestionnaire', 'getQuestionnaires', 'addQuestionnaire', 'modifyQuestionnaire', 'deleteQuestionnaire']);
export const questionServiceMock = jasmine.createSpyObj('questionService', ['getQuestion', 'getQuestions', 'addQuestion', 'modifyQuestion', 'deleteQuestion']);
export const answerOptionServiceMock = jasmine.createSpyObj('answerOptionService', ['getAnswerOptions', 'addAnswerOption', 'modifyAnswerOption', 'deleteAnswerOption', 'updateAnswerOptionAsset']);
export const inviteServiceMock = jasmine.createSpyObj('inviteService', ['getInvites', 'addInvite']);
export const toastServiceMock = jasmine.createSpyObj('toastService', ['showSuccessToast', 'showInfoToast', 'showWarningToast', 'showErrorToast'])

export class AuthoringApiServiceMock {
  // intentionally do nothing, as this should be spied upon.
  get authService(): jasmine.SpyObj<AuthService> { return authServiceMock; }
  get organizationService(): jasmine.SpyObj<OrganizationService> { return organizationServiceMock; }
  get organizationMembershipService(): jasmine.SpyObj<OrganizationMembershipService> { return organizationMembershipServiceMock; }
  get organizationRoleService(): jasmine.SpyObj<OrganizationRoleService> { return organizationRoleServiceMock; }
  get courseService(): jasmine.SpyObj<CourseService> { return courseServiceMock; }
  get chapterService(): jasmine.SpyObj<ChapterService> { return chapterServiceMock; }
  get slideService(): jasmine.SpyObj<SlideService> { return slideServiceMock; }
  get contextService(): jasmine.SpyObj<ContextService> { return contextServiceMock; }
  get commonService(): jasmine.SpyObj<CommonService> { return commonServiceMock; }
  get questionService(): jasmine.SpyObj<QuestionService> { return questionServiceMock; }
  get questionnaireService(): jasmine.SpyObj<QuestionnaireService> { return questionnaireServiceMock; }
  get answerOptionService(): jasmine.SpyObj<AnswerOptionService> { return answerOptionServiceMock; }
  get inviteService(): jasmine.SpyObj<InviteService> { return inviteServiceMock; }
  get toastService(): jasmine.SpyObj<ToastService> { return toastServiceMock; }
}

export const authoringApiServiceMock = new AuthoringApiServiceMock();

export class VisibilityManagerServiceMock {
  public sidebarVisibilityChanged: ReplaySubject<EVisibilityStatus> = new ReplaySubject(1);
  public sidebarVisibilityChanged$: Observable<EVisibilityStatus> = this.sidebarVisibilityChanged.asObservable();

  private _sidebarVisibility: EVisibilityStatus = EVisibilityStatus.eHidden;
  public get sidebarVisibility(): EVisibilityStatus { return this._sidebarVisibility; }
  public set sidebarVisibility(v: EVisibilityStatus) { this._sidebarVisibility = v; this.sidebarVisibilityChanged.next(v); }
}

//export type VisibilityManagerServiceMock = Pick<VisibilityManagerService, keyof VisibilityManagerService>;

export function createVisibilityManagerServiceMock(): VisibilityManagerServiceMock {
  return new VisibilityManagerServiceMock();
}
