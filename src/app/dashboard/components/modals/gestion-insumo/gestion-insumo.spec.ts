import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionInsumo } from './gestion-insumo';

describe('GestionInsumo', () => {
  let component: GestionInsumo;
  let fixture: ComponentFixture<GestionInsumo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionInsumo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionInsumo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
