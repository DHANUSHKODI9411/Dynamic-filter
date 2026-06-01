import { TestBed } from '@angular/core/testing';

import { DynamicFilterService } from './dynamic-filter-service';

describe('DynamicFilterService', () => {
  let service: DynamicFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
