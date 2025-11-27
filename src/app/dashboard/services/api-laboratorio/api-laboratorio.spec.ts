import { TestBed } from '@angular/core/testing';

import { ApiLaboratorio } from './api-laboratorio';

describe('ApiLaboratorio', () => {
  let service: ApiLaboratorio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiLaboratorio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
