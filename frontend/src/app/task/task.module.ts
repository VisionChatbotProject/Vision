import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskContainerComponent } from './components/task-container/task-container.component';
import { TableModule } from 'primeng/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TaskTableComponent } from './components/task-table/task-table.component';
import { SaveTaskComponent } from './modals/save-task/save-task.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TaskContainerComponent,
    TaskTableComponent,
    SaveTaskComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    FontAwesomeModule,
    NgbAccordionModule,
    ReactiveFormsModule,
  ],
  exports: [
    TaskContainerComponent,
  ]
})
export class TaskModule { }
