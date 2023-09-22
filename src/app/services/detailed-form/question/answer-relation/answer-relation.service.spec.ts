import { TestBed } from '@angular/core/testing';

import { AnswerRelationService } from './answer-relation.service';

describe('AnswerRelationService', () => {
  let service: AnswerRelationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnswerRelationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
