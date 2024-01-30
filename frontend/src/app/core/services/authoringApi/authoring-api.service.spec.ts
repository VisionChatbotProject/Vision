import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../auth/auth.service';
import { ChapterService } from '../chapter/chapter.service';
import { CommonService } from '../common/common.service';
import { CourseService } from '../course/course.service';
import { QuestionnaireService } from '../questionnaire/questionnaire.service';
import { InviteService } from '../intive/invite.service';
import { OrganizationMembershipService } from '../organization-membership/organization-membership.service';
import { OrganizationRoleService } from '../organization-role/organization-role.service';
import { OrganizationService } from '../organization/organization.service';
import { SlideService } from '../slide/slide.service';
import { ContextService } from '../context/context.service';
import { AuthoringApiService } from './authoring-api.service';
import { QuestionService } from '../question/question.service';
import { AnswerOptionService } from '../answer-option/answer-option.service';

let backendAuthServiceMock: jasmine.SpyObj<AuthService>;
let backendOrganizationServiceMock: jasmine.SpyObj<OrganizationService>;
let backendOrganizationMembershipServiceMock: jasmine.SpyObj<OrganizationMembershipService>;
let backendOrganizationRoleServiceMock: jasmine.SpyObj<OrganizationRoleService>;
let backendCourseServiceMock: jasmine.SpyObj<CourseService>;
let backendChapterServiceMock: jasmine.SpyObj<ChapterService>;
let backendSlideServiceMock: jasmine.SpyObj<SlideService>;
let backendQuestionnaireServiceMock: jasmine.SpyObj<QuestionnaireService>;
let backendQuestionServiceMock: jasmine.SpyObj<QuestionService>;
let backendAnswerOptionServiceMock: jasmine.SpyObj<AnswerOptionService>;
let backendCommonServiceMock: jasmine.SpyObj<CommonService>;
let backendInviteServiceMock: jasmine.SpyObj<InviteService>;
let contextServiceMock: jasmine.SpyObj<ContextService> = jasmine.createSpyObj('ContextService', [], { activeOrganization: null });

describe('AuthoringApiService', () => {
  let service: AuthoringApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        //Backends:
        { provide: AuthService, useValue: backendAuthServiceMock },
        { provide: OrganizationService, useValue: backendOrganizationServiceMock },
        { provide: OrganizationMembershipService, useValue: backendOrganizationMembershipServiceMock },
        { provide: OrganizationRoleService, useValue: backendOrganizationRoleServiceMock },
        { provide: CourseService, useValue: backendCourseServiceMock },
        { provide: ChapterService, useValue: backendChapterServiceMock },
        { provide: SlideService, useValue: backendSlideServiceMock },
        { provide: QuestionnaireService, useValue: backendQuestionnaireServiceMock },
        { provide: QuestionService, useValue: backendQuestionServiceMock },
        { provide: AnswerOptionService, useValue: backendAnswerOptionServiceMock },
        { provide: InviteService, useValue: backendInviteServiceMock },
        // Additionals
        { provide: ContextService, useValue: contextServiceMock },
        { provide: CommonService, useValue: backendCommonServiceMock }
      ]
    });
    service = TestBed.inject(AuthoringApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve the context service', () => {
    expect(service.contextService).toEqual(contextServiceMock);
  });

  it('authService should return an auth service', () => {
    expect(service.authService).toEqual(backendAuthServiceMock);
  });

  it('organizationService should return an organization service', () => {
    expect(service.organizationService).toEqual(backendOrganizationServiceMock);
  });

  it('organizationMembershipService should return an organization membership service', () => {
    expect(service.organizationMembershipService).toEqual(backendOrganizationMembershipServiceMock);
  });

  it('organizationRoleService should return an organization role service', () => {
    expect(service.organizationRoleService).toEqual(backendOrganizationRoleServiceMock);
  });

  it('courseService should return a course service', () => {
    expect(service.courseService).toEqual(backendCourseServiceMock);
  });

  it('chapterService should return a chapter service', () => {
    expect(service.chapterService).toEqual(backendChapterServiceMock);
  });

  it('slideService should return a slide service', () => {
    expect(service.slideService).toEqual(backendSlideServiceMock);
  });

  it('questionnaireService should return an questionnaire service', () => {
    expect(service.questionnaireService).toEqual(backendQuestionnaireServiceMock);
  });

  it('questionService should return an question service', () => {
    expect(service.questionService).toEqual(backendQuestionServiceMock);
  });

  it('answerOptionService should return an answer option service', () => {
    expect(service.answerOptionService).toEqual(backendAnswerOptionServiceMock);
  });

  it('commonService should return a commonService service', () => {
    expect(service.commonService).toEqual(backendCommonServiceMock);
  });

  it('inviteService should return an invite service', () => {
    expect(service.inviteService).toEqual(backendInviteServiceMock);
  });

});
