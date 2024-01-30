import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntentContainerComponent } from './components/intent-container/intent-container.component';
import { TableModule } from 'primeng/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { IntentTableComponent } from './components/intent-table/intent-table.component';
import { SaveIntentComponent } from './modals/save-intent/save-intent.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    IntentContainerComponent,
    IntentTableComponent,
    SaveIntentComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    FontAwesomeModule,
    NgbAccordionModule,
    ReactiveFormsModule,
  ],
  exports: [
    IntentContainerComponent,
  ]
})
export class IntentModule { }
