import { Component, Input, Output, EventEmitter } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ReorderModalComponent } from "src/app/core-ui/modals/reorder-modal/reorder-modal.component";
import { IChapter } from "src/app/core/models/chapter";

interface TableData {
  title: string,
  shortDescription: string,
  lastModified: Date,
  id: number,
}

@Component({
  selector: 'sac-chapter-table',
  templateUrl: './chapter-table.component.html',
  styleUrls: ['./chapter-table.component.scss']
})
export class ChapterTableComponent {

  private _tableData: TableData[] = [];

  @Input() public set chapters(values: IChapter[]) {
    this._tableData = values.map(c => {
      return { id: c.id, title: c.title, shortDescription: c.shortDescription, lastModified: c.modifiedAt! }
    });
  }
  public get tableData(): TableData[] { return this._tableData; }

  @Output() addChapter: EventEmitter<void> = new EventEmitter<void>();
  @Output() editChapter: EventEmitter<number> = new EventEmitter<number>();
  @Output() openChapter: EventEmitter<number> = new EventEmitter<number>();
  @Output() deleteChapter: EventEmitter<number> = new EventEmitter<number>();
}
