import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ChapterProcessingMock } from 'src/testutils/component-mocks';

import { ChapterComponent } from './chapter.component';

describe('ChapterComponent', () => {
  let component: ChapterComponent;
  let fixture: ComponentFixture<ChapterComponent>;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChapterComponent, ChapterProcessingMock],
      imports: [RouterTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChapterComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should parse valid ids in the queryMap', () => {
    const spyRoute = spyOn(activatedRoute.snapshot.queryParamMap, 'get').withArgs('id').and.returnValue('12345');
    component.ngOnInit();
    expect(spyRoute).toHaveBeenCalledWith('id');
    expect(component.chapterId).toEqual(12345);
  });

  it('should ignore invalid ids in the queryMap', () => {
    const spyRoute = spyOn(activatedRoute.snapshot.queryParamMap, 'get').withArgs('id').and.returnValue('notAnInteger');
    component.ngOnInit();
    expect(spyRoute).toHaveBeenCalledWith('id');
    expect(component.chapterId).toEqual(-1);
  });

});
