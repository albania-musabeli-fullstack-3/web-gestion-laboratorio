import { ComponentFixture, TestBed } from '@angular/core/testing';

import Insumos from './insumos';
import { Insumo } from '../../interfaces/insumo.interface';
import { ApiInsumos } from '../../services/api-insumos/api-insumos';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('Insumos', () => {
  /* let component: Insumos;
  let fixture: ComponentFixture<Insumos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Insumos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Insumos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  }); */

  let service: ApiInsumos;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiInsumos]
    });
    service = TestBed.inject(ApiInsumos);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all insumos via GET', () => {
    const mockInsumos: Insumo[] = [
      { id: 1, nombre: 'Insumo1', cantidad: 10, precio: 5.99 },
      { id: 2, nombre: 'Insumo2', cantidad: 20, precio: 10.50 }
    ];

    service.getAllInsumos().subscribe((insumos) => {
      expect(insumos.length).toBe(2);
      expect(insumos).toEqual(mockInsumos);
    });

    const req = httpMock.expectOne('http://localhost:8082/api/insumo');
    expect(req.request.method).toBe('GET');
    req.flush(mockInsumos);
  });

  it('should handle HTTP error in getAllInsumos', () => {
    const errorMessage = 'Error simulado';

    service.getAllInsumos().subscribe({
      next: () => fail('Debería fallar'),
      error: (error:any) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
        expect(error.error).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne('http://localhost:8082/api/insumo');
    expect(req.request.method).toBe('GET');
    req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
  });
});
