import { NgModule } from '@angular/core';
import { CoreUiModule } from '../core-ui/core-ui.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CoursePreviewComponent } from './components/course-preview/course-preview.component';
import { RecentlyEditedCoursesComponent } from './components/recently-edited-courses/recently-edited-courses.component';
import { OrganizationComponent } from './components/organization/organization.component';
import { OrganizationPreviewComponent } from './components/organization-preview/organization-preview.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CoursePreviewComponent,
    RecentlyEditedCoursesComponent,
    OrganizationComponent,
    OrganizationPreviewComponent,
  ],
  imports: [
    CoreUiModule,
    DashboardRoutingModule,
  ]
})
export class DashboardModule { }
