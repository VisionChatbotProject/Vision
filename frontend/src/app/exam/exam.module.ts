import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamContainerComponent } from './components/exam-container/exam-container.component';
import { TableModule } from 'primeng/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ExamTableComponent } from './components/exam-table/exam-table.component';
import { SaveExamComponent } from './modals/save-exam/save-exam.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ExamContainerComponent,
    ExamTableComponent,
    SaveExamComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    FontAwesomeModule,
    NgbAccordionModule,
    ReactiveFormsModule,
  ],
  exports: [
    ExamContainerComponent,
  ]
})
export class ExamModule { }
