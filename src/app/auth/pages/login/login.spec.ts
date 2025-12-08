import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { AuthApi } from '../../services/auth-api';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideRouter, Router, RouterLink } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { of, throwError } from 'rxjs';
import { AlertService } from '../../../shared/services/alert-service';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceSpy: jasmine.SpyObj<AuthApi>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthApi>('AuthApi', ['login']);
    alertServiceSpy = jasmine.createSpyObj<AlertService>('AlertService', ['handlerAlerta']);

    await TestBed.configureTestingModule({
      imports: [
        Login,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        RouterLink
      ],
      providers: [
        FormBuilder,
        { provide: AuthApi, useValue: authServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        provideRouter([]),
        provideLocationMocks()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values and validators', () => {
    const form = component.formLogin;
    expect(form).toBeDefined();
    expect(form.controls['email'].value).toBe('sofia@correo.com');
    expect(form.controls['email'].valid).toBeTrue();
    expect(form.controls['password'].value).toBe('Password123$');
    expect(form.controls['password'].valid).toBeTrue();
    expect(form.controls['email'].hasValidator(Validators.required)).toBeTrue();
    expect(form.controls['email'].hasValidator(Validators.email)).toBeTrue();
    expect(form.controls['password'].hasValidator(Validators.required)).toBeTrue();
  });

  it('should mark email as invalid if empty', () => {
    component.formLogin.controls['email'].setValue('');
    expect(component.formLogin.controls['email'].invalid).toBeTrue();
  });

  it('should mark email as invalid if not a valid email', () => {
    component.formLogin.controls['email'].setValue('invalid-email');
    expect(component.formLogin.controls['email'].invalid).toBeTrue();
  });

  it('should mark password as invalid if empty', () => {
    component.formLogin.controls['password'].setValue('');
    expect(component.formLogin.controls['password'].invalid).toBeTrue();
  });

  it('should not call login service if form is invalid', () => {
    spyOn(console, 'log');
    component.formLogin.controls['email'].setValue('');
    component.formLogin.controls['password'].setValue('');
    component.login();
    expect(console.log).toHaveBeenCalledWith(component.formLogin.value);
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should call login service with correct email and password when form is valid', () => {
    spyOn(console, 'log');
    component.formLogin.controls['email'].setValue('test@correo.com');
    component.formLogin.controls['password'].setValue('Test123$');
    authServiceSpy.login.and.returnValue(of({ id: 1, name: 'Test User' }));
    component.login();
    expect(console.log).toHaveBeenCalledWith(component.formLogin.value);
    expect(authServiceSpy.login).toHaveBeenCalledWith('test@correo.com', 'Test123$');
  });

  it('should store user in localStorage, log response, and navigate to "/" on successful login', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    spyOn(console, 'log');
    spyOn(localStorage, 'setItem');
    component.formLogin.controls['email'].setValue('test@correo.com');
    component.formLogin.controls['password'].setValue('Test123$');
    const mockResponse = { id: 1, name: 'Test User' };
    authServiceSpy.login.and.returnValue(of(mockResponse));
    component.login();
    expect(console.log).toHaveBeenCalledWith(component.formLogin.value);
    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(mockResponse);
    expect(localStorage.setItem).toHaveBeenCalledWith('usuario', JSON.stringify(mockResponse));
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should call alert service and log error on login error', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    spyOn(console, 'log');
    component.formLogin.controls['email'].setValue('test@correo.com');
    component.formLogin.controls['password'].setValue('Test123$');
    const mockError = new Error('Login failed');
    authServiceSpy.login.and.returnValue(throwError(() => mockError));
    component.login();
    expect(console.log).toHaveBeenCalledWith(component.formLogin.value);
    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(mockError);
    expect(alertServiceSpy.handlerAlerta).toHaveBeenCalledWith(
      'Advertencia',
      'Correo y/o contraseña incorrectos. Inténtelo nuevamente',
      'warning'
    );
    expect(router.navigate).not.toHaveBeenCalled();
  });
});