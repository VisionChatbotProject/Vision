import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Observable } from "rxjs";
import { IImage } from "src/app/core-ui/components/image-chooser/image-chooser.component";
import { IAnswerOption } from "src/app/core/models/answer_options";
import { ICourse } from "src/app/core/models/course";
import { IInvite } from "src/app/core/models/invite";
import { IOrganization } from "src/app/core/models/organization";
import { IOrganizationMembership } from "src/app/core/models/organization_membership";
import { IIntent } from "src/app/intent/models/intent.model";
import { IExam } from "src/app/exam/models/exam.model";
import { ITask } from "src/app/task/models/task.model";

export class NgbModalRefMock {
  componentInstance = {
  };
  result: Promise<any> = new Promise((resolve, reject) => resolve(true));
}

@Component({
  selector: 'sma-topbar',
  template: ''
})
export class TopbarMock { }

@Component({
  selector: 'sma-sidebar',
  template: ''
})
export class SidebarMock { }

@Component({
  selector: 'sms-panel-toggle',
  template: ''
})
export class PanelToggleMock {
  @Input() opened: boolean = false;
}

@Component({
  selector: 'sms-image-chooser',
  template: ''
})
export class ImageChooserMock {
  @Input() image: IImage = {} as IImage;
  @Output() imageChange: EventEmitter<IImage> = new EventEmitter();
}

@Component({
  selector: 'dab-course-preview',
  template: ''
})
export class CoursePreviewMock {
  @Input() course: ICourse | null = null;
}

@Component({
  selector: 'sac-course-detail',
  template: ''
})
export class CourseDetailMock {
}

@Component({
  selector: 'dab-recently-edited-courses',
  template: ''
})
export class RecentlyEditedCoursesMock {
}

@Component({
  selector: 'dab-organization',
  template: ''
})
export class OrganizationMock {
}

@Component({
  selector: 'dab-organization-preview',
  template: ''
})
export class OrganizationPreviewMock {
  @Input() organization: IOrganization | null = null;
  @Input() memberships: IOrganizationMembership[] | null = null;
}

@Component({
  selector: 'sac-course-processing',
  template: ''
})
export class CourseProcessingMock {
  @Input() courseId: number | null = null;
}

@Component({
  selector: 'ssa-organization-check',
  template: ''
})
export class OrganizationCheckComponentMock {
}

@Component({
  selector: 'sac-course-table',
  template: ''
})
export class CourseTableMock {
}

@Component({
  selector: 'sac-chapter-processing',
  template: ''
})
export class ChapterProcessingMock {
  @Input() chapterId: number | null = null;
}

@Component({
  selector: 'smg-grapes-js-holder',
  template: ''
})
export class GrapesJsHolderMock {
}

@Component({
  selector: 'sao-invite-table',
  template: '',
})
export class InviteTableComponentMock {
  @Input() public set invites(values: IInvite[]) { }
}

@Component({
  selector: 'sao-member-table',
  template: '',
})
export class MemberTableComponentMock {
  @Input() public set memberships(values: IOrganizationMembership[]) {
  }
}

@Component({
  selector: 'app-answer-option-list',
  template: '',
})
export class AnswerOptionListComponentMock {
  @Output() addAnswerOption: EventEmitter<number> = new EventEmitter<number>();
  @Output() editAnswerOption: EventEmitter<IAnswerOption> = new EventEmitter<IAnswerOption>();
  @Output() deleteAnswerOption: EventEmitter<IAnswerOption> = new EventEmitter<IAnswerOption>();
}

@Component({
  selector: 'int-intent-table',
  template: '',
})
export class IntentTableComponentMock {
  @Input() public intents: IIntent[] = [];

  @Output() public editIntent: EventEmitter<IIntent> = new EventEmitter();
  @Output() public deleteIntent: EventEmitter<IIntent> = new EventEmitter();
}

@Component({
  selector: 'int-intent-container',
  template: '',
})
export class IntentContainerComponentMock {
  @Output() public addIntent: EventEmitter<IIntent> = new EventEmitter();
}

@Component({
  selector: 'int-exam-table',
  template: '',
})
export class ExamTableComponentMock {
  @Input() public exams: IExam[] = [];

  @Output() public editExam: EventEmitter<IExam> = new EventEmitter();
  @Output() public deleteExam: EventEmitter<IExam> = new EventEmitter();
}

@Component({
  selector: 'int-task-table',
  template: '',
})
export class TaskTableComponentMock { 
  @Input() public tasks: ITask[] = [];

  @Output() public editTask: EventEmitter<ITask> = new EventEmitter();
  @Output() public deleteTask: EventEmitter<ITask> = new EventEmitter();
}