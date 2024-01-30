import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'sms-panel-toggle',
  templateUrl: './panel-toggle.component.html',
  styleUrls: ['./panel-toggle.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PanelToggleComponent {

  private _opened : boolean = true;
  public get opened() : boolean { return this._opened; }
  @Input() public set opened(v : boolean) { this._opened = v; }
  
  constructor() { }
}
