import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IInvite } from 'src/app/core/models/invite';

interface TableData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  code: string;
  dateCreated: Date | undefined,
  expirationDate: Date | undefined,
};

@Component({
  selector: 'sao-invite-table',
  templateUrl: './invite-table.component.html',
  styleUrls: ['./invite-table.component.scss']
})
export class InviteTableComponent {
  private _tableData: TableData[] = [];
  public get tableData(): TableData[] { return this._tableData; }

  @Input() public set invites(values: IInvite[]) {
    this._tableData =
      values
        .filter(v => !v.used)
        .map(v => {
          return {
            id: v.id,
            firstName: v.person.firstName,
            lastName: v.person.lastName,
            email: v.email,
            code: v.code,
            dateCreated: v.dateCreated,
            expirationDate: v.expirationDate
          }
        }
      );
  }

  @Output() editInvite: EventEmitter<number> = new EventEmitter<number>();
  @Output() deleteInvite: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }
}
