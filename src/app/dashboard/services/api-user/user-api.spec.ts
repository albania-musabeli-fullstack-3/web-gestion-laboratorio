import { TestBed } from '@angular/core/testing';
import { UserApi } from './user-api';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('UserApi', () => {
  let service: UserApi;
  let httpController: HttpTestingController;

  const mockUser = {
    id: 123,
    nombre: 'Juan Pérez',
    email: 'juan@example.com'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserApi]
    });

    service = TestBed.inject(UserApi);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifica que no haya peticiones pendientes
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call PUT to update user with correct URL and body', () => {
    // Act
    service.updateUser(mockUser).subscribe(response => {
      expect(response).toEqual(mockUser); // el backend devuelve el usuario actualizado
    });

    // Assert: capturamos la petición
    const req = httpController.expectOne('http://localhost:8080/api/usuario/123');

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockUser);

    // Respondemos con el mismo usuario (simulando éxito)
    req.flush(mockUser);
  });

  it('should handle error when update fails', () => {
    const errorMessage = 'Error del servidor';
    const errorStatus = 500;

    service.updateUser(mockUser).subscribe({
      next: () => fail('debería haber fallado'),
      error: (error) => {
        expect(error.status).toBe(errorStatus);
        expect(error.error).toBe(errorMessage);
      }
    });

    const req = httpController.expectOne('http://localhost:8080/api/usuario/123');
    expect(req.request.method).toBe('PUT');

    // Simulamos error del servidor
    req.flush(errorMessage, { status: errorStatus, statusText: 'Internal Server Error' });
  });
});