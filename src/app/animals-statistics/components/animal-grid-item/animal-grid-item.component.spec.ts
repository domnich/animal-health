import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalGridItemComponent } from './animal-grid-item.component';

describe('AnimalGridItemComponent', () => {
  let component: AnimalGridItemComponent;
  let fixture: ComponentFixture<AnimalGridItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimalGridItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimalGridItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
