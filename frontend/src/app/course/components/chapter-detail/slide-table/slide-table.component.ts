import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ISlide } from 'src/app/core/models/slide';

interface TableData {
  id: number,
  title: string,
  lastModified: Date
}

@Component({
  selector: 'sac-slide-table',
  templateUrl: './slide-table.component.html',
  styleUrls: ['./slide-table.component.scss']
})
export class SlideTableComponent {

  private _tableData: TableData[] = [];

  @Input() public set slides(values: ISlide[]) { this._tableData = values.map(s => { 
    return { id: s.id, title: s.title, lastModified: s.modifiedAt! } 
  });
  }
  public get tableData(): TableData[] { return this._tableData; }

  @Output() addSlide: EventEmitter<void> = new EventEmitter<void>();
  @Output() editSlide: EventEmitter<number> = new EventEmitter<number>();
  @Output() openSlide: EventEmitter<number> = new EventEmitter<number>();
  @Output() deleteSlide: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

}
