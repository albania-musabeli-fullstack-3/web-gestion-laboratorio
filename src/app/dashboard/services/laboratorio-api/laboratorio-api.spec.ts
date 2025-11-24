import { TestBed } from '@angular/core/testing';

import { LaboratorioApi } from './laboratorio-api';

describe('LaboratorioApi', () => {
  let service: LaboratorioApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaboratorioApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
