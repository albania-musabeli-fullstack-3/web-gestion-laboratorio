import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionLab } from './gestion-lab';

describe('GestionLab', () => {
  let component: GestionLab;
  let fixture: ComponentFixture<GestionLab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionLab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionLab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
