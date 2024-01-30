import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent  {

  private _title: string | null = null;
  public get title(): string | null { return this._title; }
  @Input() public set title(s: string | null) { this._title = s; };

  private _text: string | null = null;
  public get text(): string | null { return this._text; }
  @Input() public set text(s: string | null) { this._text = s; };

  public get activeModal(): NgbActiveModal { return this._activeModal; }

  constructor(
    private _activeModal: NgbActiveModal
  ) {
  }
}
