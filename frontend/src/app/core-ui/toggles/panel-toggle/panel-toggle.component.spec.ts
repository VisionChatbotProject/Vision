import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeIconsModuleMock } from 'src/testutils/built-in-mocks';
import { getHTMLElement } from 'src/testutils/utils';

import { PanelToggleComponent } from './panel-toggle.component';

describe('PanelToggleComponent', () => {
  let component: PanelToggleComponent;
  let fixture: ComponentFixture<PanelToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports : [FontAwesomeIconsModuleMock],
      declarations: [PanelToggleComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the [close] button when opened', () => {
    component.opened = false;
    fixture.detectChanges();
    let opened = getHTMLElement(fixture, '#opened')
    let closed = getHTMLElement(fixture, '#closed')

    expect(closed).toBeDefined();
    expect(opened).toBeNull();
  });

  it('should show the [open] button when closed', () => {
    component.opened = true;
    fixture.detectChanges();
    let opened = getHTMLElement(fixture, '#opened')
    let closed = getHTMLElement(fixture, '#closed')

    expect(opened).toBeDefined();
    expect(closed).toBeNull();
  });
});
