import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';


@Directive({
  selector: '[confirm]'
})
export class ConfirmDirective {

  @Output() public confirm: EventEmitter<void> = new EventEmitter<void>();
  @Output() public reject: EventEmitter<void> = new EventEmitter<void>();

  private _confirmTitle: string | null = null;
  @Input() public set confirmTitle(s: string | null) { this._confirmTitle = s; }

  private _confirmDescription: string | null = null;
  @Input() public set confirmDescription(s: string | null) { this._confirmDescription = s; };

  constructor(
    private modalService: NgbModal
  ) { }

  @HostListener('click', ['$event'])
  public clickEvent($event: any) {
    $event.preventDefault();
    
    const modalRef = this.modalService.open(ConfirmModalComponent, {backdrop: 'static'});
    modalRef.componentInstance.title = this._confirmTitle;
    modalRef.componentInstance.text = this._confirmDescription;
    modalRef.result.then(
      accepted => this.confirm.emit(),
      rejected => this.reject.emit()
    );
  }

}
