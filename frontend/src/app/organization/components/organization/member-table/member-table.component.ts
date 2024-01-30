import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IOrganizationMembership } from 'src/app/core/models/organization_membership';


interface TableData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: number;
}

@Component({
  selector: 'sao-member-table',
  templateUrl: './member-table.component.html',
  styleUrls: ['./member-table.component.scss']
})
export class MemberTableComponent {
  private _tableData: TableData[] = [];

  @Input() public set memberships(values: IOrganizationMembership[]) {
    this._tableData = values
      .filter(v => v.virtual == false)
      .map(v => { return { ...v } }
    );
  }

  public get tableData(): TableData[] {
    return this._tableData;
  }

  @Output() editMember: EventEmitter<number> = new EventEmitter<number>();
  @Output() deleteMember: EventEmitter<number> = new EventEmitter<number>();
}
