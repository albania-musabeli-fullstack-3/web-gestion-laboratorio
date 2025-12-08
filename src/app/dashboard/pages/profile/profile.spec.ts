import { ComponentFixture, TestBed } from '@angular/core/testing';
import Profile from './profile';
import { AuthApi } from '../../../auth/services/auth-api';
import { UserApi } from '../../services/api-user/user-api';
import { UserStorage } from '../../services/user-storage/user-storage';
import { AlertService } from '../../../shared/services/alert-service';
import { of, throwError } from 'rxjs';

describe('Profile Component', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;
  let apiAuthMock: jasmine.SpyObj<AuthApi>;
  let apiUserMock: jasmine.SpyObj<UserApi>;
  let storageMock: jasmine.SpyObj<UserStorage>;
  let alertMock: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {

    apiAuthMock = jasmine.createSpyObj('AuthApi', ['recoveryUserPassword']);
    apiUserMock = jasmine.createSpyObj('UserApi', ['updateUser']);
    storageMock = jasmine.createSpyObj('UserStorage', ['loadUserFromLocalStorage']);
    alertMock = jasmine.createSpyObj('AlertService', ['handlerAlerta']);

    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        { provide: AuthApi, useValue: apiAuthMock },
        { provide: UserApi, useValue: apiUserMock },
        { provide: UserStorage, useValue: storageMock },
        { provide: AlertService, useValue: alertMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
  

  it('should NOT call getUser when localStorage usuario is null', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const getSpy = spyOn(component, 'getUser');

    fixture.detectChanges();

    expect(getSpy).not.toHaveBeenCalled();
    expect(component.formProfile.controls.correo.disabled).toBeTrue();
  });


  it('should call getUser when userLogin exists', () => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ correo: 'test@mail.com' }));
    const getSpy = spyOn(component, 'getUser');

    fixture.detectChanges();

    expect(getSpy).toHaveBeenCalledWith('test@mail.com');
    expect(component.formProfile.controls.correo.disabled).toBeTrue();
  });
  

  it('should patch form values on getUser success', () => {
    const mockRes = {
      nombre: 'Juan',
      correo: 'juan@mail.com',
      password: '1234',
      id: 7
    };

    apiAuthMock.recoveryUserPassword.and.returnValue(of(mockRes));
    component.getUser('juan@mail.com');

    expect(apiAuthMock.recoveryUserPassword).toHaveBeenCalledWith('juan@mail.com');
    expect(component.formProfile.value.nombre).toBe('Juan');
    expect(component.formProfile.value.password).toBe('1234');
    expect(component.formProfile.value.id!).toBe(7);
  });


  it('should log error on getUser error', () => {
    const consoleSpy = spyOn(console, 'log');
    apiAuthMock.recoveryUserPassword.and.returnValue(
      throwError(() => ({ error: { message: 'Fail get user' } }))
    );

    component.getUser('x@mail.com');
    expect(consoleSpy).toHaveBeenCalledWith('Fail get user');
  });
  

  it('should update profile successfully', () => {
    const mockUpdate = {
      nombre: 'Nuevo',
      correo: 'new@mail.com',
      password: '123',
      id: 1
    };

    apiUserMock.updateUser.and.returnValue(of(mockUpdate));
    const getSpy = spyOn(component, 'getUser');
    const lsSetSpy = spyOn(localStorage, 'setItem');

    component.editarPerfil();

    expect(apiUserMock.updateUser).toHaveBeenCalled();
    expect(getSpy).toHaveBeenCalledWith('new@mail.com');
    expect(lsSetSpy).toHaveBeenCalled();
    expect(storageMock.loadUserFromLocalStorage).toHaveBeenCalled();
    expect(alertMock.handlerAlerta).toHaveBeenCalledWith('Éxito', 'Datos actualizados', 'success');
  });


  it('should handle updateUser error with errors array', () => {
    const consoleSpy = spyOn(console, 'log');

    const mockError = {
      error: {
        errors: [{ message: 'Correo inválido' }]
      }
    };

    apiUserMock.updateUser.and.returnValue(
      throwError(() => mockError)
    );

    const getSpy = spyOn(component, 'getUser');
    component.formProfile.controls['correo'].setValue('test@mail.com');
    component.editarPerfil();

    expect(consoleSpy).toHaveBeenCalledWith(mockError.error.errors);
    expect(alertMock.handlerAlerta).toHaveBeenCalledWith(
      'Advertencia',
      'Correo inválido',
      'warning'
    );
    expect(getSpy).toHaveBeenCalledWith('test@mail.com');
  });
  

  it('should handle updateUser error without errors array', () => {
    const consoleSpy = spyOn(console, 'log');

    const mockError = {
      error: {
        errors: 'otro tipo de error'
      }
    };

    apiUserMock.updateUser.and.returnValue(
      throwError(() => mockError)
    );

    component.editarPerfil();
    expect(consoleSpy).toHaveBeenCalledWith('otro tipo de error');
    expect(alertMock.handlerAlerta).not.toHaveBeenCalled();
  });
});
