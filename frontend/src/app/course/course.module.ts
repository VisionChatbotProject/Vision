import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseRoutingModule } from './course-routing.module';
import { CoursesOverviewComponent } from './components/courses-overview/courses-overview.component';
import { ChapterComponent } from './components/chapter/chapter.component';
import { ChapterProcessingComponent } from './components/chapter-processing/chapter-processing.component';
import { CoreUiModule } from '../core-ui/core-ui.module';
import { GrapesJsModule } from '../grapesjs/grapesjs.module';
import { CourseTableComponent } from './components/courses-overview/course-table/course-table.component';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';
import { ChapterTableComponent } from './components/course-detail/chapter-table/chapter-table.component';
import { QuestionnaireTableComponent } from './components/course-detail/questionnaire-table/questionnaire-table.component';
import { ChapterDetailComponent } from './components/chapter-detail/chapter-detail.component';
import { SlideTableComponent } from './components/chapter-detail/slide-table/slide-table.component';
import { QuestionnaireDetailComponent } from './components/questionnaire-detail/questionnaire-detail.component';
import { QuestionListComponent } from './components/questionnaire-detail/question-list/question-list.component';
import { AnswerOptionListComponent } from './components/questionnaire-detail/answer-option-list/answer-option-list.component';
import { IntentModule } from '../intent/intent.module';
import { ExamModule } from '../exam/exam.module';
import { TaskModule } from '../task/task.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    CoursesOverviewComponent,
    ChapterComponent,
    CourseDetailComponent,
    ChapterProcessingComponent,
    CourseTableComponent,
    ChapterTableComponent,
    QuestionnaireTableComponent,
    ChapterDetailComponent,
    SlideTableComponent,
    QuestionnaireDetailComponent,
    QuestionListComponent,
    AnswerOptionListComponent
  ],
  imports: [
    CommonModule,
    CoreUiModule,
    GrapesJsModule,
    CourseRoutingModule,
    IntentModule,
    ExamModule,
    TaskModule,
    HttpClientModule,
  ]
})
export class CourseModule { }
