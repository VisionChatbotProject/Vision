import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerOptionListComponent } from './answer-option-list.component';

describe('AnswerOptionListComponent', () => {
  let component: AnswerOptionListComponent;
  let fixture: ComponentFixture<AnswerOptionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnswerOptionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerOptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
