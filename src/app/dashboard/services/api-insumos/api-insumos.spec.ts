import { TestBed } from '@angular/core/testing';

import { ApiInsumos } from './api-insumos';

describe('ApiInsumos', () => {
  let service: ApiInsumos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiInsumos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
