import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import Laboratorios from './laboratorios';
import { ApiLaboratorio } from '../../services/api-laboratorio/api-laboratorio';
import { AlertService } from '../../../shared/services/alert-service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { of, throwError } from 'rxjs';
import { GestionLab } from '../../components/modals/gestion-lab/gestion-lab';


describe('Laboratorios', () => {
  let component: Laboratorios;
  let fixture: ComponentFixture<Laboratorios>;
  let apiSpy: jasmine.SpyObj<ApiLaboratorio>;
  let alertSpy: jasmine.SpyObj<AlertService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const mockLaboratorios = [
    { id: 3, nombre: 'Lab C', direccion: 'Dir C', telefono: '999999999', correo: 'c@lab.com', especialidad: 'Cardiología' },
    { id: 2, nombre: 'Lab B', direccion: 'Dir B', telefono: '888888888', correo: 'b@lab.com', especialidad: 'Neurología' },
    { id: 1, nombre: 'Lab A', direccion: 'Dir A', telefono: '777777777', correo: 'a@lab.com', especialidad: 'Oncología' }
  ];

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj<ApiLaboratorio>('ApiLaboratorio', ['getAllLaboratorios', 'eliminarLaboratorio']);
    alertSpy = jasmine.createSpyObj<AlertService>('AlertService', ['confirmar', 'handlerAlerta']);
    dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

    // Valores por defecto
    apiSpy.getAllLaboratorios.and.returnValue(of([...mockLaboratorios]));
    alertSpy.confirmar.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [
        Laboratorios,
        MatDialogModule
      ],
      providers: [
        { provide: ApiLaboratorio, useValue: apiSpy },
        { provide: AlertService, useValue: alertSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Laboratorios);
    component = fixture.componentInstance;

    // Simulamos que @ViewChild(MatPaginator) ya está resuelto
    component.paginator = { pageSize: 10, pageIndex: 0, length: 0 } as MatPaginator;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Carga inicial
  it('should load laboratorios on init and sort by id descending', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(apiSpy.getAllLaboratorios).toHaveBeenCalled();
    expect(component.dataSource.data[0].id).toBe(3);
    expect(component.dataSource.paginator).toBe(component.paginator);
  }));

  it('should log error when getAllLaboratorios fails', fakeAsync(() => {
    spyOn(console, 'log');
    apiSpy.getAllLaboratorios.and.returnValue(throwError(() => 'Network error'));

    component.ngOnInit();
    tick();

    expect(console.log).toHaveBeenCalledWith('Network error');
  }));

  // Modal: abrir
  it('should open modal to add new laboratorio', () => {
    component.openModalAgregarEditarLab();
    expect(dialogSpy.open).toHaveBeenCalledWith(GestionLab, jasmine.objectContaining({
      width: '800px',
      maxWidth: '95vw',
      autoFocus: false,
      disableClose: false,
      data: { laboratorio: null, editar: false }
    }));
  });

  it('should open modal to edit existing laboratorio', () => {
    const lab = mockLaboratorios[0];
    component.openModalAgregarEditarLab(lab, true);
    expect(dialogSpy.open).toHaveBeenCalledWith(GestionLab, jasmine.objectContaining({
      data: { laboratorio: lab, editar: true }
    }));
  });

  // Modal: afterClosed() → 3 casos críticos para 100% coverage
  it('should refresh list when modal closes with status true', fakeAsync(() => {
    spyOn(component, 'getAllLaboratorios');
    dialogSpy.open.and.returnValue({ afterClosed: () => of({ status: true }) } as any);

    component.openModalAgregarEditarLab();
    tick();

    expect(component.getAllLaboratorios).toHaveBeenCalledTimes(1);
  }));

  it('should NOT refresh when modal closes with status false', fakeAsync(() => {
    spyOn(component, 'getAllLaboratorios');
    dialogSpy.open.and.returnValue({ afterClosed: () => of({ status: false }) } as any);

    component.openModalAgregarEditarLab();
    tick();

    expect(component.getAllLaboratorios).not.toHaveBeenCalled();
  }));

  it('should NOT refresh when modal is dismissed (result is undefined)', fakeAsync(() => {
    spyOn(component, 'getAllLaboratorios');
    dialogSpy.open.and.returnValue({ afterClosed: () => of(undefined) } as any);

    component.openModalAgregarEditarLab();
    tick();

    expect(component.getAllLaboratorios).not.toHaveBeenCalled();
  }));

  // Eliminación
  it('should delete laboratorio when confirmed', fakeAsync(() => {
    apiSpy.eliminarLaboratorio.and.returnValue(of({}));
    const lab = { ...mockLaboratorios[0], id: 5 };

    component.eliminarLaboratorio(lab);
    tick(); // confirmar
    tick(); // eliminar

    expect(apiSpy.eliminarLaboratorio).toHaveBeenCalledWith(5);
    expect(alertSpy.handlerAlerta).toHaveBeenCalledWith('Eliminado', 'El laboratorio ha sido eliminado', 'success');
    expect(component.getAllLaboratorios).toHaveBeenCalled();
  }));

  it('should show warning if deletion fails due to associated results (409)', fakeAsync(() => {
    apiSpy.eliminarLaboratorio.and.returnValue(throwError(() => ({ status: 409 })));

    component.eliminarLaboratorio(mockLaboratorios[0]);
    tick();
    tick();

    expect(alertSpy.handlerAlerta).toHaveBeenCalledWith('Precaución', 'Este laboratorio tiene resultados asociados', 'warning');
  }));

  it('should show warning and log error on generic deletion error', fakeAsync(() => {
    spyOn(console, 'error');
    apiSpy.eliminarLaboratorio.and.returnValue(throwError(() => new Error('Server error')));

    component.eliminarLaboratorio(mockLaboratorios[0]);
    tick();
    tick();

    expect(console.error).toHaveBeenCalled();
    expect(alertSpy.handlerAlerta).toHaveBeenCalledWith('Precaución', 'Este laboratorio tiene resultados asociados', 'warning');
  }));

  it('should not delete if user cancels confirmation', fakeAsync(() => {
    alertSpy.confirmar.and.returnValue(Promise.resolve(false));

    component.eliminarLaboratorio(mockLaboratorios[0]);
    tick();

    expect(apiSpy.eliminarLaboratorio).not.toHaveBeenCalled();
  }));

  it('should not delete if laboratorio has no id', fakeAsync(() => {
    const labSinId = { nombre: 'Sin ID' } as any;
    component.eliminarLaboratorio(labSinId);
    tick();

    expect(alertSpy.confirmar).not.toHaveBeenCalled();
    expect(apiSpy.eliminarLaboratorio).not.toHaveBeenCalled();
  }));
});