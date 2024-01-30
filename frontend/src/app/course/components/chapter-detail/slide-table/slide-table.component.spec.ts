import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideTableComponent } from './slide-table.component';

describe('SlideTableComponent', () => {
  let component: SlideTableComponent;
  let fixture: ComponentFixture<SlideTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlideTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
