import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { AuthApi } from './auth-api';
import { UserRequest } from '../interfaces/auth.request';

describe('AuthApi Service', () => {
  let service: AuthApi;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8080/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthApi,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should perform login POST request correctly', () => {
    const correo = 'test@correo.com';
    const password = 'Test123$';
    const mockResponse = { token: 'abc123' };

    service.login(correo, password).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/usuario/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ correo, password });

    req.flush(mockResponse);
  });


  it('should perform register POST request correctly', () => {
    const mockRequest: UserRequest = {
      correo: 'test@correo.com',
      password: 'Test123$',
      nombre: 'Test User',
      roles: [1]
    };
    const mockResponse = { id: 1 };

    service.register(mockRequest).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/usuario`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);

    req.flush(mockResponse);
  });

  
  it('should perform recoveryUserPassword GET request correctly', () => {
    const correo = 'test@correo.com';
    const mockResponse = { password: 'RecoveredPass' };

    service.recoveryUserPassword(correo).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/usuario/recoveryPassword?correo=${correo}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });
});