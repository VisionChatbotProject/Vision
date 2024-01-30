import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IQuestionnaire } from 'src/app/core/models/questionnaire';

interface TableData {
  lastModified: Date,
  id: number,  
}

@Component({
  selector: 'sac-questionnaire-table',
  templateUrl: './questionnaire-table.component.html',
  styleUrls: ['./questionnaire-table.component.scss']
})
export class QuestionnaireTableComponent {

  private _tableData: TableData[] = [];

  @Input() public set questionnaires(values: IQuestionnaire[]) { this._tableData = values.map(e => { 
      return { id: e.id, lastModified: e.modifiedAt!, title: e.title } 
    });
  }
  public get tableData(): TableData[] { return this._tableData; }

  @Output() addQuestionnaire: EventEmitter<void> = new EventEmitter<void>();
  @Output() editQuestionnaire: EventEmitter<number> = new EventEmitter<number>();
  @Output() openQuestionnaire: EventEmitter<number> = new EventEmitter<number>();
  @Output() deleteQuestionnaire: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }
}
