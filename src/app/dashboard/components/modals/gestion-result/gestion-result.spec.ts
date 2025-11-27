import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionResult } from './gestion-result';

describe('GestionResult', () => {
  let component: GestionResult;
  let fixture: ComponentFixture<GestionResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionResult]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionResult);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
