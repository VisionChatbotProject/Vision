import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IIntent } from '../../models/intent.model';

@Component({
  selector: 'int-intent-table',
  templateUrl: './intent-table.component.html',
  styleUrls: ['./intent-table.component.scss']
})
export class IntentTableComponent implements OnInit {

  private _intents: IIntent[] = [];
  @Input() public set intents(i: IIntent[]) { this._intents = i; }
  public get intents(): IIntent[] { return this._intents; }
  
  @Output() public editIntent: EventEmitter<IIntent> = new EventEmitter();
  @Output() public deleteIntent: EventEmitter<IIntent> = new EventEmitter();
  
  constructor() { }

  ngOnInit(): void {
  }

  public onEditIntent(intent: IIntent): void {
    this.editIntent.emit(intent);
  }

  public onDeleteIntent(intent: IIntent): void {
    this.deleteIntent.emit(intent);
  }


}
