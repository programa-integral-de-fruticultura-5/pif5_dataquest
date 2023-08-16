import { TestBed } from '@angular/core/testing';

import { DetailedFormService } from './detailed-form.service';

describe('DetailedFormService', () => {
  let service: DetailedFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailedFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
