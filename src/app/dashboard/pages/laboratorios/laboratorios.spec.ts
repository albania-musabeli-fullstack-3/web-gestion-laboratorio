import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Laboratorios } from './laboratorios';

describe('Laboratorios', () => {
  let component: Laboratorios;
  let fixture: ComponentFixture<Laboratorios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Laboratorios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Laboratorios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
