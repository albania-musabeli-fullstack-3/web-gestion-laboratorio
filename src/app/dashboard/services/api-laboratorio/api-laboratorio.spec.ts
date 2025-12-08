import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiLaboratorio } from './api-laboratorio';
import { Laboratorio, ResultadoReq, ResultadosLabRes } from '../../interfaces/laboratorio.interface';

describe('ApiLaboratorio', () => {
  let service: ApiLaboratorio;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8081/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiLaboratorio]
    });

    service = TestBed.inject(ApiLaboratorio);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  
  it('should get all laboratorios', () => {
    const mockResp: Laboratorio[] = [
      { id: 1, nombre: 'Lab X' },
      { id: 2, nombre: 'Lab Y' }
    ] as any;

    service.getAllLaboratorios().subscribe(resp => {
      expect(resp).toEqual(mockResp);
    });

    const req = httpMock.expectOne(`${baseUrl}/laboratorio`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResp);
  });

  
  it('should create a laboratorio', () => {
    const body: Laboratorio = { id: 10, nombre: 'Nuevo Lab' } as any;

    service.createLaboratorio(body).subscribe(resp => {
      expect(resp).toEqual(body);
    });

    const req = httpMock.expectOne(`${baseUrl}/laboratorio`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush(body);
  });

  
  it('should get all resultados de analisis', () => {
    const mockResp: ResultadosLabRes[] = [
      { id: 1, resultado: 'OK' },
      { id: 2, resultado: 'Error' }
    ] as any;

    service.getAllResultadosAnalisis().subscribe(resp => {
      expect(resp).toEqual(mockResp);
    });

    const req = httpMock.expectOne(`${baseUrl}/resultado`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResp);
  });

  
  it('should edit a laboratorio', () => {
    const id = 5;
    const body: Laboratorio = { id: 5, nombre: 'Lab Editado' } as any;

    service.editarLaboratorio(id, body).subscribe(resp => {
      expect(resp).toEqual(body);
    });

    const req = httpMock.expectOne(`${baseUrl}/laboratorio/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);
    req.flush(body);
  });

  
  it('should delete a laboratorio', () => {
    const id = 99;

    service.eliminarLaboratorio(id).subscribe(resp => {
      expect(resp).toBeTruthy();
    });

    const req = httpMock.expectOne(`${baseUrl}/laboratorio/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  
  it('should create a resultado', () => {
    const body: ResultadoReq = { descripcion: 'Nuevo resultado' } as any;
    const mockResp: ResultadosLabRes = { id: 1, resultado: 'Nuevo resultado' } as any;

    service.createResultado(body).subscribe(resp => {
      expect(resp).toEqual(mockResp);
    });

    const req = httpMock.expectOne(`${baseUrl}/resultado`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush(mockResp);
  });

  
  it('should edit a resultado', () => {
    const id = 3;
    const body: ResultadoReq = { descripcion: 'Actualizado' } as any;
    const mockResp: ResultadosLabRes = { id: 3, resultado: 'Actualizado' } as any;

    service.editarResultado(id, body).subscribe(resp => {
      expect(resp).toEqual(mockResp);
    });

    const req = httpMock.expectOne(`${baseUrl}/resultado/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);
    req.flush(mockResp);
  });

  
  it('should delete a resultado', () => {
    const id = 7;

    service.eliminarResultado(id).subscribe(resp => {
      expect(resp).toBeTruthy();
    });

    const req = httpMock.expectOne(`${baseUrl}/resultado/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
