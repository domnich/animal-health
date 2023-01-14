import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalsGridComponent } from './animals-grid.component';

describe('AnimalsGridComponent', () => {
  let component: AnimalsGridComponent;
  let fixture: ComponentFixture<AnimalsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimalsGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimalsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
