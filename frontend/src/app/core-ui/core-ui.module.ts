import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { NgbAccordionModule, NgbCollapseModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from '../core/core.module';
import { SaveCourseModalComponent } from './modals/save-course-modal/save-course-modal.component';
import { SaveOrganizationModal } from './modals/save-organization-modal/save-organization-modal.component';
import { PanelToggleComponent } from './toggles/panel-toggle/panel-toggle.component';
import { ImageChooserComponent } from './components/image-chooser/image-chooser.component';
import { TableModule } from 'primeng/table';
import { LoadingComponent } from './components/loading/loading.component';
import { SaveChapterModalComponent } from './modals/save-chapter-modal/save-chapter-modal.component';
import { SaveSlideModalComponent } from './modals/save-slide-modal/save-slide-modal.component';
import { ConfirmDirective } from './directives/confirm/confirm.directive';
import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component';
import { InviteMemberModalComponent } from './modals/invite-member-modal/invite-member-modal.component';
import { SaveQuestionnaireModalComponent } from './modals/save-questionnaire-modal/save-questionnaire-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { SaveQuestionModalComponent } from './modals/save-question-modal/save-question-modal.component';
import { SaveAnswerOptionModalComponent } from './modals/save-answer-option-modal/save-answer-option-modal.component';
import { ToastComponent } from './components/toast/toast.component';
import { ToasterComponent } from './components/toaster/toaster.component';
import { ReorderModalComponent } from './modals/reorder-modal/reorder-modal.component';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    PanelToggleComponent,
    SaveCourseModalComponent,
    SaveOrganizationModal,
    ImageChooserComponent,
    LoadingComponent,
    SaveChapterModalComponent,
    SaveSlideModalComponent,
    ConfirmDirective,
    ConfirmModalComponent,
    InviteMemberModalComponent,
    SaveQuestionnaireModalComponent,
    SaveQuestionModalComponent,
    SaveAnswerOptionModalComponent,
    ToastComponent,
    ToasterComponent,
    ReorderModalComponent,
  ],
  imports: [
    CoreModule,
    HttpClientModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbAccordionModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    TableModule,
    NgbTooltipModule,
    DragDropModule,
  ],
  exports: [
    NgbCollapseModule,
    NgbDropdownModule,
    NgbAccordionModule,
    FontAwesomeModule,
    NgbTooltipModule,
    CoreModule,
    TableModule,

    // Components:
    PanelToggleComponent,
    LoadingComponent,
    ToastComponent,
    ToasterComponent,

    //Directives:
    ConfirmDirective,
  ]
})
export class CoreUiModule {
  constructor(
    library: FaIconLibrary
  ) {
    library.addIconPacks(far, fas);
  }
}
