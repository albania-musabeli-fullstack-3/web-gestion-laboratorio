import { ComponentFixture, TestBed } from '@angular/core/testing';
import RecoveryPassword from './recovery-password';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { AuthApi } from '../../services/auth-api';
import { AlertService } from '../../../shared/services/alert-service';
import { of, throwError } from 'rxjs';

describe('RecoveryPassword Component', () => {
  let component: RecoveryPassword;
  let fixture: ComponentFixture<RecoveryPassword>;
  let authServiceSpy: jasmine.SpyObj<AuthApi>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthApi>('AuthApi', ['recoveryUserPassword']);
    alertServiceSpy = jasmine.createSpyObj<AlertService>('AlertService', ['handlerAlerta']);

    await TestBed.configureTestingModule({
      imports: [
        RecoveryPassword,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
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

    fixture = TestBed.createComponent(RecoveryPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values and validators', () => {
    const form = component.formRecovery;
    expect(form).toBeDefined();
    expect(form.controls['email'].value).toBe('');
    expect(form.controls['email'].invalid).toBeTrue();
    expect(form.controls['email'].hasValidator(Validators.required)).toBeTrue();
    expect(form.controls['email'].hasValidator(Validators.email)).toBeTrue();
  });

  it('should mark email as invalid if empty', () => {
    component.formRecovery.controls['email'].setValue('');
    expect(component.formRecovery.controls['email'].invalid).toBeTrue();
  });


  it('should mark email as invalid if not a valid email', () => {
    component.formRecovery.controls['email'].setValue('invalid-email');
    expect(component.formRecovery.controls['email'].invalid).toBeTrue();
  });


  it('should mark email as valid if correct', () => {
    component.formRecovery.controls['email'].setValue('test@correo.com');
    expect(component.formRecovery.controls['email'].valid).toBeTrue();
  });


  it('should call recovery service with email and handle success', () => {
    spyOn(console, 'log');
    spyOn(component.formRecovery, 'reset');

    component.formRecovery.controls['email'].setValue('test@correo.com');

    const mockResponse = { password: 'NewPass123' };
    authServiceSpy.recoveryUserPassword.and.returnValue(of(mockResponse));

    component.recoveryPassword();

    expect(authServiceSpy.recoveryUserPassword).toHaveBeenCalledWith('test@correo.com');
    expect(console.log).toHaveBeenCalledWith(mockResponse);
    expect(alertServiceSpy.handlerAlerta).toHaveBeenCalledWith(
      'Datos recuperados',
      `Su contraseña es: ${mockResponse.password}`,
      'success'
    );
    expect(component.formRecovery.reset).toHaveBeenCalled();
  });

  
  it('should call recovery service with email and handle error', () => {
    spyOn(console, 'log');
    spyOn(component.formRecovery, 'reset');

    component.formRecovery.controls['email'].setValue('test@correo.com');

    const mockError = { error: { message: 'Error message' } };
    authServiceSpy.recoveryUserPassword.and.returnValue(throwError(() => mockError));

    component.recoveryPassword();

    expect(authServiceSpy.recoveryUserPassword).toHaveBeenCalledWith('test@correo.com');
    expect(console.log).toHaveBeenCalledWith(mockError.error.message);
    expect(alertServiceSpy.handlerAlerta).toHaveBeenCalledWith(
      'Advertencia',
      mockError.error.message,
      'warning'
    );
    expect(component.formRecovery.reset).toHaveBeenCalled();
  });
});