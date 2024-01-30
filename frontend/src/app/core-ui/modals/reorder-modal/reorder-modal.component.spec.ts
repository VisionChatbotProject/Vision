import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { IIdentifiable, IOrderable } from 'src/app/core/models/base';
import { clickElement, getHTMLElement } from 'src/testutils/utils';

import { NO_LABEL, ReorderModalComponent } from './reorder-modal.component';

interface IReorderTestEntity extends IIdentifiable, IOrderable {
  name: string,
}

const testData: IReorderTestEntity[] = [
  {
    order: 0,
    id: 1,
    name: 'Entity 1'
  },
  {
    order: 1,
    id: 2,
    name: 'Entity 2'
  },
];

describe('ReorderModalComponent', () => {
  let component: ReorderModalComponent<IReorderTestEntity>;
  let fixture: ComponentFixture<ReorderModalComponent<IReorderTestEntity>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReorderModalComponent],
      providers: [NgbActiveModal]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent<ReorderModalComponent<IReorderTestEntity>>(ReorderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should take orderables and identifiables as input', () => {
    component.orderables = testData;
  });

  it('should take a callback as input for reordering', () => {
    component.reorderAction = (entity: IReorderTestEntity) => of(testData);
  });

  it('should take a labelKey as input for displaying', () => {
    component.labelKey = 'name'
  });

  it('should display all items with the given label', () => {
    component.orderables = testData;
    component.labelKey = 'name'
    fixture.detectChanges();

    testData.forEach(x => {
      expect(getHTMLElement(fixture, `#item-${x.id}`).textContent).toEqual(x.name)
    });
  });

  it('should display a defined label if no label has been set', () => {
    component.orderables = testData;
    fixture.detectChanges();

    testData.forEach(x => {
      expect(getHTMLElement(fixture, `#item-${x.id}`).textContent).toEqual(NO_LABEL)
    });
  });

  it('should close the modal with the reordered items', () => {
    component.orderables = testData;
    const spy = spyOn(component.activeModal, 'close')
    fixture.detectChanges();

    clickElement(fixture, '#saveOrder');
    expect(spy).toHaveBeenCalledWith(testData);
  });

});
