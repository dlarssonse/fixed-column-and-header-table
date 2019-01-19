import { TestBed } from '@angular/core/testing';

import { FixedColumnAndHeaderTableService } from './fixed-table.service';

describe('FixedColumnAndHeaderTableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FixedColumnAndHeaderTableService = TestBed.get(FixedColumnAndHeaderTableService);
    expect(service).toBeTruthy();
  });
});
