import { TestBed } from '@angular/core/testing';

import { ComplaintAssembler } from './complaint-assembler';

describe('ComplaintAssembler', () => {
  let service: ComplaintAssembler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplaintAssembler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
