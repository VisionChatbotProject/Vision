import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ChapterService } from '../chapter/chapter.service';
import { CommonService } from '../common/common.service';
import { CourseService } from '../course/course.service';
import { InviteService } from '../intive/invite.service';
import { OrganizationMembershipService } from '../organization-membership/organization-membership.service';
import { OrganizationRoleService } from '../organization-role/organization-role.service';
import { OrganizationService } from '../organization/organization.service';
import { QuestionnaireService } from '../questionnaire/questionnaire.service';
import { SlideService } from '../slide/slide.service';
import { ContextService } from '../context/context.service';
import { QuestionService } from '../question/question.service';
import { AnswerOptionService } from '../answer-option/answer-option.service';
import { ToastService } from '../toast/toast.service';

/**
 * This is the base API service for accessing the backend 
 * of the smart authoring tool. This is the service components should inject
 * in case they want to make backend calls to perform CRUD operations
 * on resources.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthoringApiService {

  /**
   * Getter for auth service
   * @returns a {@link IAuthService} 
   */
  public get contextService(): ContextService { return this._contextService; }

  /**
   * Getter for auth service
   * @returns a {@link IAuthService} 
   */
  public get authService(): AuthService { return this._backendAuthService; }

  /**
   * Getter for organization service
   * @returns a {@link IOrganizationService}
   */
  public get organizationService(): OrganizationService { return this._backendOrganizationService; }

  /**
   * Getter for the organization membership service
   * @returns a {@link IOrganizationMembershipService}
   */
  public get organizationMembershipService(): OrganizationMembershipService { return this._backendOrganizationMembershipService; }

  /**
   * Getter for the organization role service
   * @returns a {@link IOrganizationRoleService}
   */
  public get organizationRoleService(): OrganizationRoleService { return this._backendOrganizationRoleService; }

  /**
   * Getter for the course service
   * @returns a {@link ICourseService}
   */
  public get courseService(): CourseService { return this._backendCourseService; }

  /**
   * Getter for the chapter service
   * @returns a {@link IChapterService}
   */
  public get chapterService(): ChapterService { return this._backendChapterService; }

  /**
   * Getter for the slide service
   * @returns a {@link ISlideService}
   */
  public get slideService(): SlideService { return this._backendSlideService; }

  /**
   * Getter for the questionnaire service
   * @returns a {@link IQuestionnaireService}
   */
  public get questionnaireService(): QuestionnaireService { return this._backendQuestionnaireService; }

  /**
   * Getter for the question service
   * @returns a {@link IQuestionService}
   */
     public get questionService(): QuestionService { return this._backendQuestionService; }

  /**
   * Getter for the answer option service
   * @returns a {@link IAnswerOptionService}
   */
   public get answerOptionService(): AnswerOptionService { return this._backendAnswerOptionService; }

  /**
   * Getter for the common service
   * @returns a {@link ICommonService}
   */
  public get commonService(): CommonService { return this._commonService; }

  /**
   * Getter for the invite service
   * @returns a {@link IInviteService}
   */
  public get inviteService(): InviteService { return this._backendInviteService; }

  /**
   * Getter for the toast service
   * @returns a {@link ToastService}
   */
  public get toastService(): ToastService { return this._toastService; }

  constructor(
    // Backend services:
    private _backendAuthService: AuthService,
    private _backendOrganizationService: OrganizationService,
    private _backendOrganizationMembershipService: OrganizationMembershipService,
    private _backendOrganizationRoleService: OrganizationRoleService,
    private _backendCourseService: CourseService,
    private _backendChapterService: ChapterService,
    private _backendSlideService: SlideService,
    private _backendQuestionnaireService: QuestionnaireService,
    private _backendQuestionService: QuestionService,
    private _backendAnswerOptionService: AnswerOptionService,
    private _toastService: ToastService,
    private _backendInviteService: InviteService,
    // Additional services:
    private _contextService: ContextService,
    private _commonService: CommonService,
  ) {
  }
}
