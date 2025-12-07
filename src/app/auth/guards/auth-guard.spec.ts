import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { authGuard } from './auth-guard';

describe('authGuard', () => {
 
  
  let routerSpy: jasmine.SpyObj<Router>;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  const executeGuard = (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) =>
    TestBed.runInInjectionContext(() => authGuard(r, s));

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    });

    route = new ActivatedRouteSnapshot();
    state = { url: '/dashboard' } as RouterStateSnapshot;

    localStorage.clear();
  });

  it('debería permitir acceso si existe usuario o token', () => {
    localStorage.setItem('usuario', 'test');

    const result = executeGuard(route, state);

    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('debería bloquear acceso y redirigir cuando no hay usuario', () => {
    const result = executeGuard(route, state);

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/login'],
      { queryParams: { returnUrl: '/dashboard' } }
    );
  });


  // const executeGuard: CanActivateFn = (...guardParameters) => 
  //     TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  // beforeEach(() => {
  //   TestBed.configureTestingModule({});
  // });

  // it('should be created', () => {
  //   expect(executeGuard).toBeTruthy();
  // });
});
