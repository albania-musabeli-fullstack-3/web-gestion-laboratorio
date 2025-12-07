import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import Home from './home';
import { UserStorage } from '../../services/user-storage/user-storage';
import { SidebarMenu } from '../../services/sidebar-menu/sidebar-menu';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let router: Router;

  interface User { id: number; nombre: string; correo: string; rol: string; }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home, RouterTestingModule],
      providers: [
        { provide: UserStorage, useValue: { userLoginComp: signal<User | null>(null) } },
        { provide: SidebarMenu, useValue: { menu: signal([]) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Cubre: userLoginComp()?.nombre (existe)
  it('should set name when user exists', () => {
    TestBed.overrideProvider(UserStorage, {
      useValue: { userLoginComp: signal<User>({ id: 1, nombre: 'Juan', correo: '', rol: '' }) }
    });
    const comp = TestBed.createComponent(Home).componentInstance;
    comp.ngOnInit();
    expect(comp.nombre()).toBe('Juan');
  });

  // Cubre: userLoginComp() === null → usa ''
  it('should set empty name when user is null', () => {
    component.ngOnInit();
    expect(component.nombre()).toBe('');
  });

  // Cubre: primerMenu existe + submenu existe → rama del if
  it('should load submenu when first menu has items', () => {
    TestBed.overrideProvider(SidebarMenu, {
      useValue: {
        menu: signal([
          { label: 'Dashboard', submenu: [{ label: 'Labs', route: '/labs' }] }
        ])
      }
    });
    const comp = TestBed.createComponent(Home).componentInstance;
    comp.ngOnInit();
    expect(comp.programas().length).toBe(1);
  });

  // Cubre: primerMenu existe + submenu === undefined → entra al if pero usa ?? []
  it('should handle first menu with undefined submenu (nullish coalescing)', () => {
    TestBed.overrideProvider(SidebarMenu, {
      useValue: {
        menu: signal([
          { label: 'Dashboard' } // submenu undefined
        ])
      }
    });
    const comp = TestBed.createComponent(Home).componentInstance;
    comp.ngOnInit();
    expect(comp.programas()).toEqual([]);
  });

  // Cubre: primerMenu === undefined (menu vacío) → entra al else
  it('should set empty programs when menu is empty (else branch)', () => {
    TestBed.overrideProvider(SidebarMenu, {
      useValue: { menu: signal([]) }
    });
    const comp = TestBed.createComponent(Home).componentInstance;
    comp.ngOnInit();
    expect(comp.programas()).toEqual([]);
  });

  // Cubre los 3 saludos
  it('should show correct greeting based on hour', fakeAsync(() => {
    const cases = [
      { hour: 5, expected: 'Buenos días' },
      { hour: 12, expected: 'Buenas tardes' },
      { hour: 18, expected: 'Buenas noches' }
    ];

    cases.forEach(({ hour, expected }) => {
      jasmine.clock().mockDate(new Date(2025, 0, 1, hour, 0));
      component.ngOnInit();
      flush();
      expect(component.saludo).toBe(expected);
    });
  }));

  it('should update time and date', fakeAsync(() => {
    jasmine.clock().mockDate(new Date(2025, 11, 7, 15, 30));
    component.ngOnInit();
    flush();
    expect(component.horaActual).toBe('15:30');
    expect(component.fechaActual).toBe('7 de diciembre de 2025');
  }));

  it('should navigate', () => {
    component.navegarCards('/test');
    expect(router.navigate).toHaveBeenCalledWith(['/test']);
  });
});