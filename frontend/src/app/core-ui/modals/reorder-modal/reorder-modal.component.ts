import { CdkDragDrop, CDK_DRAG_CONFIG, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { IIdentifiable, IOrderable } from 'src/app/core/models/base';

const DragConfig = {
  dragStartThreshold: 0,
  pointerDirectionChangeThreshold: 5,
  zIndex: 10000
};

export const NO_LABEL = 'NO LABEL';

export type TReorderAction<TEntity> = (item: TEntity) => Observable<TEntity[]>;
@Component({
  selector: 'app-reorder-modal',
  templateUrl: './reorder-modal.component.html',
  styleUrls: ['./reorder-modal.component.scss'],
  providers: [{ provide: CDK_DRAG_CONFIG, useValue: DragConfig }]
})
export class ReorderModalComponent<TEntity extends IOrderable & IIdentifiable> implements OnInit {

  private _orderables: TEntity[] = []
  @Input() public set orderables(o: TEntity[]) { this._orderables = o.sort((x, y) => x.order - y.order); }
  public get orderables(): TEntity[] { return this._orderables }

  public get activeModal(): NgbActiveModal { return this._activeModal; }

  private _labelKey: keyof TEntity | null = null;
  @Input() public set labelKey(k: keyof TEntity | null) { this._labelKey = k; }
  public get labelKey(): keyof TEntity | null { return this._labelKey; }

  private _reorderAction: TReorderAction<TEntity> = (item: TEntity) => of(this._orderables);
  public set reorderAction(r: TReorderAction<TEntity>) { this._reorderAction = r; }

  constructor(
    private _activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

  public drop(event: CdkDragDrop<TEntity[]>) {
    moveItemInArray(this._orderables, event.previousIndex, event.currentIndex);
    this._orderables.forEach((item: TEntity, index: number) => item.order = index);
    const reorderedItem: TEntity = this._orderables.find(x => x.id == event.item.data.id)!;
    this._reorderAction(reorderedItem).pipe(take(1)).subscribe(orderables => this._orderables = orderables);
  }

  public getLabel(item: TEntity): unknown {
    if (this._labelKey) { return item[this._labelKey]; }
    else { return NO_LABEL; }
  }

  public saveOrder(): void {
    this._activeModal.close(this._orderables);
  }

}
