import { ComponentFixture, TestBed } from '@angular/core/testing';

import CreateAccount from './create-account';
import { AuthApi } from '../../services/auth-api';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AlertService } from '../../../shared/services/alert-service';

describe('CreateAccount', () => {

  let component: CreateAccount;
  let authServiceSpy: jasmine.SpyObj<AuthApi>;
  let alertSpy: jasmine.SpyObj<AlertService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthApi', ['register']);
    alertSpy = jasmine.createSpyObj('AlertService', ['handlerAlerta']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        { provide: AuthApi, useValue: authServiceSpy },
        { provide: AlertService, useValue: alertSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    component = TestBed.runInInjectionContext(() => new CreateAccount());
  });


  // PRUEBAS DE VALIDACIONES
  it('debe alertar si el nombre es inválido', () => {
    component.form.patchValue({
      nombre: '',
      correo: 'test@test.com',
      password1: 'Abc!1234',
      password2: 'Abc!1234'
    });

    component.crearUsuario();

    expect(alertSpy.handlerAlerta).toHaveBeenCalledWith(
      'Advertencia',
      'Ingrese un nombre válido (mínimo 3 letras)',
      'warning'
    );
  });

  it('debe alertar si el correo es inválido', () => {
    component.form.patchValue({
      nombre: 'Juan',
      correo: 'correo-malo',
      password1: 'Abc!1234',
      password2: 'Abc!1234'
    });

    component.crearUsuario();

    expect(alertSpy.handlerAlerta).toHaveBeenCalledWith(
      'Advertencia',
      'Ingrese un correo válido',
      'warning'
    );
  });

  it('debe alertar si password1 es inválida', () => {
    component.form.patchValue({
      nombre: 'Juan',
      correo: 'test@test.com',
      password1: 'abc',
      password2: 'abc'
    });

    component.crearUsuario();

    expect(alertSpy.handlerAlerta).toHaveBeenCalledWith(
      'Advertencia',
      'La contraseña debe tener mayúsculas, minúsculas, número, símbolo y 8-20 caracteres',
      'warning'
    );
  });

  it('debe alertar si password2 es inválida', () => {
    component.form.patchValue({
      nombre: 'Juan',
      correo: 'test@test.com',
      password1: 'Abc!1234',
      password2: ''
    });

    component.crearUsuario();

    expect(alertSpy.handlerAlerta).toHaveBeenCalledWith(
      'Advertencia',
      'Debe repetir la contraseña',
      'warning'
    );
  });

  it('debe alertar si las contraseñas no coinciden', () => {
    component.form.patchValue({
      nombre: 'Juan',
      correo: 'test@test.com',
      password1: 'Abc!1234',
      password2: 'Different123!'
    });

    component.crearUsuario();

    expect(alertSpy.handlerAlerta).toHaveBeenCalledWith(
      'Advertencia',
      'Las contraseñas no coinciden',
      'warning'
    );
  });
  

  // PRUEBAS DE LLAMADA AL SERVICIO
  it('debe llamar al servicio register y navegar en éxito', () => {
    authServiceSpy.register.and.returnValue(of({ message: 'ok' }));

    component.form.patchValue({
      nombre: 'Juan',
      correo: 'test@test.com',
      password1: 'Abc!1234',
      password2: 'Abc!1234'
    });

    component.crearUsuario();

    expect(authServiceSpy.register).toHaveBeenCalled();
    expect(alertSpy.handlerAlerta).toHaveBeenCalledWith(
      'Éxito',
      'Cuenta creada correctamente',
      'success'
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debe manejar error del register', () => {
    authServiceSpy.register.and.returnValue(
      throwError(() => ({ error: { message: 'Error del backend' } }))
    );

    component.form.patchValue({
      nombre: 'Juan',
      correo: 'test@test.com',
      password1: 'Abc!1234',
      password2: 'Abc!1234'
    });

    component.crearUsuario();

    expect(alertSpy.handlerAlerta).toHaveBeenCalledWith(
      'Error',
      'Error del backend',
      'error'
    );
    expect(component.cargando).toBeFalse();
  });

  it('debe manejar complete del observable', () => {
    authServiceSpy.register.and.returnValue(of({}));

    component.form.patchValue({
      nombre: 'Juan',
      correo: 'test@test.com',
      password1: 'Abc!1234',
      password2: 'Abc!1234'
    });

    component.crearUsuario();

    expect(component.cargando).toBeFalse();
  });
  
});
