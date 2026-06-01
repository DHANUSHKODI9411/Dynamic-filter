import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFilterComponent } from './dynamic-filter-component';

describe('DynamicFilterComponent', () => {
  let component: DynamicFilterComponent;
  let fixture: ComponentFixture<DynamicFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicFilterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
