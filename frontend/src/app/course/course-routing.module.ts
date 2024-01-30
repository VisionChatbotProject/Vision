import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';
import { CoursesOverviewComponent } from './components/courses-overview/courses-overview.component';
import { ChapterComponent } from './components/chapter/chapter.component';
import { ChapterDetailComponent } from './components/chapter-detail/chapter-detail.component';
import { QuestionnaireDetailComponent } from './components/questionnaire-detail/questionnaire-detail.component';

const routes: Routes = [
  { path: '', component: CoursesOverviewComponent },
  { path: 'course', component: CourseDetailComponent },
  { path: 'chapter', component: ChapterComponent },
  { path: 'chapter-detail', component: ChapterDetailComponent},
  { path: 'questionnaire-detail', component: QuestionnaireDetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }
