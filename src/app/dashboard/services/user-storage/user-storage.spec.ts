import { TestBed } from '@angular/core/testing';
import { UserStorage } from './user-storage';

describe('UserStorage', () => {
  const mockUser = {
    id: 1,
    nombre: 'Carlos Mendoza',
    correo: 'carlos@example.com',
    roles: [{ id: 1, nombre: 'admin' }]
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [UserStorage]
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    const service = TestBed.inject(UserStorage);
    expect(service).toBeTruthy();
  });

  it('should initialize with null user when localStorage is empty', () => {
    const service = TestBed.inject(UserStorage);
    expect(service.userLoginComp()).toBeNull();
  });

  it('should load user from localStorage when exists (covers if branch)', () => {
    // Guardamos el usuario
    localStorage.setItem('usuario', JSON.stringify(mockUser));

    // Forzamos una NUEVA instancia del servicio
    const service = new UserStorage();

    expect(service.userLoginComp()).toEqual(mockUser);
    expect(service.userLoginComp()?.nombre).toBe('Carlos Mendoza');
    expect(service.userLoginComp()?.roles[0].nombre).toBe('admin');
  });

  it('should NOT update signal when localStorage is empty (covers else branch)', () => {
    const service = new UserStorage();
    expect(service.userLoginComp()).toBeNull();
  });

  it('should handle corrupted JSON in localStorage without throwing', () => {
    localStorage.setItem('usuario', 'esto-no-es-json-invalido');

    expect(() => {
      new UserStorage(); // Aquí se ejecuta JSON.parse y debe fallar silenciosamente
    }).not.toThrow();

    const service = new UserStorage();
    expect(service.userLoginComp()).toBeNull();
  });
});