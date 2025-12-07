import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sidebar } from './sidebar';
import { SidebarMenu } from '../../services/sidebar-menu/sidebar-menu';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;
  let fakeSidebarService: jasmine.SpyObj<SidebarMenu>;


  const mockMenu = signal([
    { label: 'Dashboard', icon: 'home', route: '/dashboard' },
    { label: 'Laboratorios', icon: 'science', route: '/laboratorios' }
  ]);

  beforeEach(async () => {
    fakeSidebarService = jasmine.createSpyObj<SidebarMenu>('SidebarMenu', [], {
      menu: mockMenu
    });

    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [
        { provide: SidebarMenu, useValue: fakeSidebarService },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose menuItems from SidebarMenu service', () => {
    expect(component.menuItems()).toEqual(mockMenu());
    expect(component.menuItems().length).toBe(2);
    expect(component.menuItems()[0].label).toBe('Dashboard');
  });

  it('should toggle "expand" class on sidebar element when toggleSidebar() is called', () => {
    const sidebarElement = fixture.nativeElement.querySelector('#sidebar');
    expect(sidebarElement).toBeTruthy();

    component.toggleSidebar();
    fixture.detectChanges();

    expect(sidebarElement.classList.contains('expand')).toBeTrue();

    component.toggleSidebar();
    fixture.detectChanges();

    expect(sidebarElement.classList.contains('expand')).toBeFalse();
  });
});