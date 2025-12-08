import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import Resultados from './resultados';
import { ApiLaboratorio } from '../../services/api-laboratorio/api-laboratorio';
import { AlertService } from '../../../shared/services/alert-service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { of, throwError } from 'rxjs';
import { GestionResult } from '../../components/modals/gestion-result/gestion-result';

describe('Resultados', () => {
  let component: Resultados;
  let fixture: ComponentFixture<Resultados>;
  let apiSpy: jasmine.SpyObj<ApiLaboratorio>;
  let alertSpy: jasmine.SpyObj<AlertService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const mockRawResultados = [
    {
      id: 3,
      fechaAnalisis: '2023-12-01 14:30:00',
      nombreAnalisis: 'Análisis C',
      resultado: 'Positivo',
      observaciones: 'Obs C',
      laboratorio: { nombre: 'Lab C' }
    },
    {
      id: 2,
      fechaAnalisis: '2023-11-15 10:15:00',
      nombreAnalisis: 'Análisis B',
      resultado: 'Negativo',
      observaciones: 'Obs B',
      laboratorio: { nombre: 'Lab B' }
    },
    {
      id: 1,
      fechaAnalisis: '2023-10-05 09:00:00',
      nombreAnalisis: 'Análisis A',
      resultado: 'Normal',
      observaciones: 'Obs A',
      laboratorio: { nombre: 'Lab A' }
    }
  ];

  const expectedProcessedResultados = [
    {
      id: 3,
      fechaAnalisis: '2023-12-01',
      nombreAnalisis: 'Análisis C',
      resultado: 'Positivo',
      observaciones: 'Obs C',
      laboratorio: { nombre: 'Lab C' },
      nombreLab: 'Lab C'
    },
    {
      id: 2,
      fechaAnalisis: '2023-11-15',
      nombreAnalisis: 'Análisis B',
      resultado: 'Negativo',
      observaciones: 'Obs B',
      laboratorio: { nombre: 'Lab B' },
      nombreLab: 'Lab B'
    },
    {
      id: 1,
      fechaAnalisis: '2023-10-05',
      nombreAnalisis: 'Análisis A',
      resultado: 'Normal',
      observaciones: 'Obs A',
      laboratorio: { nombre: 'Lab A' },
      nombreLab: 'Lab A'
    }
  ];

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj<ApiLaboratorio>('ApiLaboratorio', ['getAllResultadosAnalisis', 'eliminarResultado']);
    alertSpy = jasmine.createSpyObj<AlertService>('AlertService', ['confirmar', 'handlerAlerta']);
    dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);


    apiSpy.getAllResultadosAnalisis.and.returnValue(of([...mockRawResultados]));
    alertSpy.confirmar.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [
        Resultados,
        MatDialogModule
      ],
      providers: [
        { provide: ApiLaboratorio, useValue: apiSpy },
        { provide: AlertService, useValue: alertSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Resultados);
    component = fixture.componentInstance;
    component.paginator = { pageSize: 10, pageIndex: 0, length: 0 } as MatPaginator;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should load resultados on init, process data, sort by id descending, and assign paginator', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(apiSpy.getAllResultadosAnalisis).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(expectedProcessedResultados);
    expect(component.dataSource.data[0].id).toBe(3);
    expect(component.dataSource.data[0].fechaAnalisis).toBe('2023-12-01');
    expect(component.dataSource.data[0].nombreLab).toBe('Lab C');
    expect(component.dataSource.paginator).toBe(component.paginator);
  }));


  it('should log res and error when getAllResultados fails', fakeAsync(() => {
    spyOn(console, 'log');
    apiSpy.getAllResultadosAnalisis.and.returnValue(throwError(() => 'Network error'));
    component.ngOnInit();
    tick();
    expect(console.log).toHaveBeenCalledWith(mockRawResultados);
    expect(console.log).toHaveBeenCalledWith('Error', 'Network error');
  }));


  it('should open modal to add new resultado', () => {
    component.openModalAgregarEditarResultado();
    expect(dialogSpy.open).toHaveBeenCalledWith(GestionResult, jasmine.objectContaining({
      width: '800px',
      maxWidth: '95vw',
      autoFocus: false,
      disableClose: false,
      data: { resultado: null, editar: false }
    }));
  });


  it('should open modal to edit existing resultado', () => {
    const res = expectedProcessedResultados[0];
    component.openModalAgregarEditarResultado(res, true);
    expect(dialogSpy.open).toHaveBeenCalledWith(GestionResult, jasmine.objectContaining({
      data: { resultado: res, editar: true }
    }));
  });


  it('should refresh list when modal closes with status true', fakeAsync(() => {
    spyOn(component, 'getAllResultados');
    dialogSpy.open.and.returnValue({ afterClosed: () => of({ status: true }) } as any);
    component.openModalAgregarEditarResultado();
    tick();
    expect(component.getAllResultados).toHaveBeenCalledTimes(1);
  }));


  it('should NOT refresh when modal closes with status false', fakeAsync(() => {
    spyOn(component, 'getAllResultados');
    dialogSpy.open.and.returnValue({ afterClosed: () => of({ status: false }) } as any);
    component.openModalAgregarEditarResultado();
    tick();
    expect(component.getAllResultados).not.toHaveBeenCalled();
  }));


  it('should NOT refresh when modal is dismissed (result is undefined)', fakeAsync(() => {
    spyOn(component, 'getAllResultados');
    dialogSpy.open.and.returnValue({ afterClosed: () => of(undefined) } as any);
    component.openModalAgregarEditarResultado();
    tick();
    expect(component.getAllResultados).not.toHaveBeenCalled();
  }));


  it('should delete resultado when confirmed', fakeAsync(() => {
    apiSpy.eliminarResultado.and.returnValue(of(expectedProcessedResultados[0]));
    const res = { ...expectedProcessedResultados[0], id: 5 };
    component.eliminarAnalisisLab(res);
    tick();
    tick();
    expect(apiSpy.eliminarResultado).toHaveBeenCalledWith(5);
    expect(alertSpy.handlerAlerta).toHaveBeenCalledWith('Eliminado', 'El resultado ha sido eliminado', 'success');
    expect(component.getAllResultados).toHaveBeenCalled();
  }));


  it('should log error on deletion failure', fakeAsync(() => {
    spyOn(console, 'log');
    apiSpy.eliminarResultado.and.returnValue(throwError(() => new Error('Server error')));
    component.eliminarAnalisisLab(expectedProcessedResultados[0]);
    tick();
    tick();
    expect(console.log).toHaveBeenCalledWith('Error', jasmine.any(Error));
  }));

  
  it('should not delete if user cancels confirmation', fakeAsync(() => {
    alertSpy.confirmar.and.returnValue(Promise.resolve(false));
    component.eliminarAnalisisLab(expectedProcessedResultados[0]);
    tick();
    expect(apiSpy.eliminarResultado).not.toHaveBeenCalled();
  }));
});