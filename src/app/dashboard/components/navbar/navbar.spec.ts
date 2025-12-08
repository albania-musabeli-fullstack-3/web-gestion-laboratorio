import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Navbar } from './navbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { provideRouter, Router } from '@angular/router';
import { AlertService } from '../../../shared/services/alert-service';


describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertSrvSpy: jasmine.SpyObj<AlertService>;
  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    alertSrvSpy = jasmine.createSpyObj<AlertService>('AlertService', ['confirmar', 'handlerAlerta']);
    await TestBed.configureTestingModule({
      imports: [
        Navbar,
        MatButtonModule,
        MatIconModule,
        MatMenuModule
      ],
      providers: [
        { provide: AlertService, useValue: alertSrvSpy },
        provideRouter([]),
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
  describe('logout', () => {
    it('should call confirmar with correct parameters', fakeAsync(() => {
      alertSrvSpy.confirmar.and.returnValue(Promise.resolve(false));
      component.logout();
      tick();
      expect(alertSrvSpy.confirmar).toHaveBeenCalledWith(
        '¿Cerrar sesión?',
        'Estás a punto de cerrar tu sesión actual',
        'Sí, cerrar sesión',
        'Cancelar'
      );
    }));


    it('should not logout if not confirmed', fakeAsync(() => {
      spyOn(localStorage, 'removeItem');
      alertSrvSpy.confirmar.and.returnValue(Promise.resolve(false));
      component.logout();
      tick();
      expect(localStorage.removeItem).not.toHaveBeenCalled();
      expect(alertSrvSpy.handlerAlerta).not.toHaveBeenCalled();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    }));


    it('should logout if confirmed', fakeAsync(() => {
      spyOn(localStorage, 'removeItem');
      alertSrvSpy.confirmar.and.returnValue(Promise.resolve(true));
      component.logout();
      tick();
      expect(localStorage.removeItem).toHaveBeenCalledWith('usuario');
      expect(alertSrvSpy.handlerAlerta).toHaveBeenCalledWith(
        'Sesión cerrada',
        'Has cerrado sesión correctamente',
        'success'
      );
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    }));
  });

});