import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GestionResult } from './gestion-result';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiLaboratorio } from '../../../services/api-laboratorio/api-laboratorio';
import { AlertService } from '../../../../shared/services/alert-service';
import { of, throwError } from 'rxjs';
import { DateTime } from 'luxon';

describe('GestionResult Component', () => {
  let component: GestionResult;
  let fixture: ComponentFixture<GestionResult>;
  let laboratorioSrvSpy: jasmine.SpyObj<ApiLaboratorio>;
  let alertSrvSpy: jasmine.SpyObj<AlertService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<GestionResult>>;
  const mockLabs = [
    { id: 2, nombre: 'Lab A', direccion: '', telefono: '', correo: '', especialidad: '' },
    { id: 1, nombre: 'Lab B', direccion: '', telefono: '', correo: '', especialidad: '' }
  ];
  const mockDataAgregar = { editar: false, resultado: null };
  const mockDataEditar = {
    editar: true,
    resultado: {
      id: 1,
      fechaAnalisis: '07/12/2025',
      nombreAnalisis: 'Analisis1',
      resultado: 'Resultado1',
      observaciones: 'Obs1',
      laboratorio: { id: 1, nombre: 'Lab B', direccion: '', telefono: '', correo: '', especialidad: '' },
      nombreLab: 'Lab B'
    }
  };

  beforeEach(() => {
    laboratorioSrvSpy = jasmine.createSpyObj<ApiLaboratorio>('ApiLaboratorio', ['getAllLaboratorios', 'createResultado', 'editarResultado']);
    alertSrvSpy = jasmine.createSpyObj<AlertService>('AlertService', ['handlerAlerta']);
    dialogRefSpy = jasmine.createSpyObj<MatDialogRef<GestionResult>>('MatDialogRef', ['close']);
    laboratorioSrvSpy.getAllLaboratorios.and.returnValue(of(mockLabs));
  });

  const configureTestBed = (data: any) => async () => {
    await TestBed.configureTestingModule({
      imports: [
        GestionResult,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule
      ],
      providers: [
        FormBuilder,
        { provide: ApiLaboratorio, useValue: laboratorioSrvSpy },
        { provide: AlertService, useValue: alertSrvSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: data },
        provideHttpClientTesting()
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(GestionResult);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  describe('in agregar mode', () => {
    beforeEach(configureTestBed(mockDataAgregar));

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
    

    it('should set title and button for agregar mode', () => {
      component.ngOnInit();
      expect(component.titulo).toBe('Agregar Resultado');
      expect(component.nombreBoton).toBe('Agregar Resultado');
    });


    it('should load and sort laboratorios on init', fakeAsync(() => {
      component.ngOnInit();
      tick();
      expect(laboratorioSrvSpy.getAllLaboratorios).toHaveBeenCalled();
      expect(component.laboratorios()).toEqual([
        { id: 2, nombre: 'Lab A', direccion: '', telefono: '', correo: '', especialidad: '' },
        { id: 1, nombre: 'Lab B', direccion: '', telefono: '', correo: '', especialidad: '' }
      ]);
    }));


    it('should handle error when loading laboratorios', () => {
      const mockError = new Error('Test error');
      spyOn(console, 'log');
      laboratorioSrvSpy.getAllLaboratorios.and.returnValue(throwError(() => mockError));
      component.listarLaboratorios();
      expect(console.log).toHaveBeenCalledWith('Error', mockError);
      expect(component.laboratorios()).toEqual([]);
    });


    it('should initialize form with empty values in agregar mode', () => {
      const form = component.formResultado;
      expect(form.controls['fechaAnalisis'].value).toBeNull();
      expect(form.controls['nombreAnalisis'].value).toBe('');
      expect(form.controls['resultado'].value).toBe('');
      expect(form.controls['observaciones'].value).toBe('');
      expect(form.controls['idLaboratorio'].value).toBeNull();
      expect(form.controls['fechaAnalisis'].hasValidator(Validators.required)).toBeTrue();
      expect(form.controls['nombreAnalisis'].hasValidator(Validators.required)).toBeTrue();
      expect(form.controls['resultado'].hasValidator(Validators.required)).toBeTrue();
      expect(form.controls['observaciones'].hasValidator(Validators.required)).toBeTrue();
      expect(form.controls['idLaboratorio'].hasValidator(Validators.required)).toBeTrue();
    });


    it('should alert if nombreAnalisis < 3 chars', () => {
      component.formResultado.setValue({
        fechaAnalisis: new Date(),
        nombreAnalisis: 'Ab',
        resultado: 'Res123',
        observaciones: 'Obs123',
        idLaboratorio: 1
      });
      component.agregarEditarResultado();
      expect(alertSrvSpy.handlerAlerta).toHaveBeenCalledWith('Advertencia', 'El nombre del análisis debe tener al menos 3 caracteres', 'warning');
      expect(laboratorioSrvSpy.createResultado).not.toHaveBeenCalled();
    });


    it('should alert if observaciones > 1000 chars', () => {
      const longObs = 'a'.repeat(1001);
      component.formResultado.setValue({
        fechaAnalisis: new Date(),
        nombreAnalisis: 'Ana123',
        resultado: 'Res123',
        observaciones: longObs,
        idLaboratorio: 1
      });
      component.agregarEditarResultado();
      expect(alertSrvSpy.handlerAlerta).toHaveBeenCalledWith('Advertencia', 'Las observaciones no pueden exceder a 1000 caracteres', 'warning');
      expect(laboratorioSrvSpy.createResultado).not.toHaveBeenCalled();
    });


    it('should alert if resultado < 3 chars', () => {
      component.formResultado.setValue({
        fechaAnalisis: new Date(),
        nombreAnalisis: 'Ana123',
        resultado: 'Re',
        observaciones: 'Obs123',
        idLaboratorio: 1
      });
      component.agregarEditarResultado();
      expect(alertSrvSpy.handlerAlerta).toHaveBeenCalledWith('Advertencia', 'El resultado debe tener al menos 3 caracteres', 'warning');
      expect(laboratorioSrvSpy.createResultado).not.toHaveBeenCalled();
    });


    it('should not call createResultado if form invalid', () => {
      component.formResultado.setValue({
        fechaAnalisis: null,
        nombreAnalisis: '',
        resultado: '',
        observaciones: '',
        idLaboratorio: null
      });
      component.agregarEditarResultado();
      expect(laboratorioSrvSpy.createResultado).not.toHaveBeenCalled();
    });


    it('should call createResultado, handle success in agregar mode with valid form', fakeAsync(() => {
      spyOn(console, 'log');
      const mockResponse = {
        id: 1,
        fechaAnalisis: '07/12/2025',
        nombreAnalisis: 'Ana123',
        resultado: 'Res123',
        observaciones: 'Obs123',
        laboratorio: { id: 1, nombre: 'Lab B', direccion: '', telefono: '', correo: '', especialidad: '' }
      };
      laboratorioSrvSpy.createResultado.and.returnValue(of(mockResponse));
      const testDate = new Date('2025-12-07T12:00:00');
      const expectedFormattedDate = DateTime.fromJSDate(testDate).toFormat("yyyy-MM-dd'T'HH:mm:ss");
      component.formResultado.setValue({
        fechaAnalisis: testDate,
        nombreAnalisis: 'Ana123',
        resultado: 'Res123',
        observaciones: 'Obs123',
        idLaboratorio: 1
      });
      component.agregarEditarResultado();
      tick();
      expect(laboratorioSrvSpy.createResultado).toHaveBeenCalledWith(jasmine.objectContaining({
        nombreAnalisis: 'Ana123',
        resultado: 'Res123',
        observaciones: 'Obs123',
        idLaboratorio: 1,
        fechaAnalisis: expectedFormattedDate
      }));
      expect(console.log).toHaveBeenCalledWith(mockResponse);
      expect(dialogRefSpy.close).toHaveBeenCalledWith({ status: true });
      expect(alertSrvSpy.handlerAlerta).toHaveBeenCalledWith('Nuevo resultado agregado', '', 'success');
    }));


    it('should call createResultado, handle error in agregar mode with valid form', fakeAsync(() => {
      spyOn(console, 'log');
      const mockError = new Error('Error');
      laboratorioSrvSpy.createResultado.and.returnValue(throwError(() => mockError));
      const testDate = new Date('2025-12-07T12:00:00');
      const expectedFormattedDate = DateTime.fromJSDate(testDate).toFormat("yyyy-MM-dd'T'HH:mm:ss");
      component.formResultado.setValue({
        fechaAnalisis: testDate,
        nombreAnalisis: 'Ana123',
        resultado: 'Res123',
        observaciones: 'Obs123',
        idLaboratorio: 1
      });
      component.agregarEditarResultado();
      tick();
      expect(laboratorioSrvSpy.createResultado).toHaveBeenCalledWith(jasmine.objectContaining({
        nombreAnalisis: 'Ana123',
        resultado: 'Res123',
        observaciones: 'Obs123',
        idLaboratorio: 1,
        fechaAnalisis: expectedFormattedDate
      }));
      expect(console.log).toHaveBeenCalledWith('Error', mockError);
      expect(dialogRefSpy.close).not.toHaveBeenCalled();
      expect(alertSrvSpy.handlerAlerta).not.toHaveBeenCalledWith('Nuevo resultado agregado', jasmine.any(String), 'success');
    }));
  });


  describe('in editar mode', () => {
    beforeEach(configureTestBed(mockDataEditar));

    it('should set title and button for editar mode', () => {
      component.ngOnInit();
      expect(component.titulo).toBe('Editar Resultado');
      expect(component.nombreBoton).toBe('Editar Resultado');
    });


    it('should load and sort laboratorios on init', fakeAsync(() => {
      component.ngOnInit();
      tick();
      expect(laboratorioSrvSpy.getAllLaboratorios).toHaveBeenCalled();
      expect(component.laboratorios()).toEqual([
        { id: 2, nombre: 'Lab A', direccion: '', telefono: '', correo: '', especialidad: '' },
        { id: 1, nombre: 'Lab B', direccion: '', telefono: '', correo: '', especialidad: '' }
      ]);
    }));


    it('should initialize form with resultado values in editar mode', () => {
      spyOn(console, 'log');
      component.ngOnInit();
      const form = component.formResultado;
      const expectedDate = DateTime.fromFormat('07/12/2025', 'dd/MM/yyyy').toJSDate();
      expect(form.controls['fechaAnalisis'].value).toEqual(expectedDate);
      expect(form.controls['nombreAnalisis'].value).toBe('Analisis1');
      expect(form.controls['idLaboratorio'].value).toBe(1);
      expect(form.controls['resultado'].value).toBe('Resultado1');
      expect(form.controls['observaciones'].value).toBe('Obs1');
    });


    it('should not call editarResultado if form invalid', () => {
      component.formResultado.setValue({
        fechaAnalisis: null,
        nombreAnalisis: '',
        resultado: '',
        observaciones: '',
        idLaboratorio: null
      });
      component.agregarEditarResultado();
      expect(laboratorioSrvSpy.editarResultado).not.toHaveBeenCalled();
    });


    it('should call editarResultado, handle success in editar mode with valid form', fakeAsync(() => {
      const mockResponse = {
        id: 1,
        fechaAnalisis: '07/12/2025',
        nombreAnalisis: 'Ana123',
        resultado: 'Res123',
        observaciones: 'Obs123',
        laboratorio: { id: 1, nombre: 'Lab B', direccion: '', telefono: '', correo: '', especialidad: '' }
      };
      laboratorioSrvSpy.editarResultado.and.returnValue(of(mockResponse));
      const testDate = new Date('2025-12-07T12:00:00');
      const expectedFormattedDate = DateTime.fromJSDate(testDate).toFormat("yyyy-MM-dd'T'HH:mm:ss");
      component.formResultado.setValue({
        fechaAnalisis: testDate,
        nombreAnalisis: 'Ana123',
        resultado: 'Res123',
        observaciones: 'Obs123',
        idLaboratorio: 1
      });
      component.agregarEditarResultado();
      tick();
      expect(laboratorioSrvSpy.editarResultado).toHaveBeenCalledWith(1, jasmine.objectContaining({
        nombreAnalisis: 'Ana123',
        resultado: 'Res123',
        observaciones: 'Obs123',
        idLaboratorio: 1,
        fechaAnalisis: expectedFormattedDate
      }));
      expect(dialogRefSpy.close).toHaveBeenCalledWith({ status: true });
      expect(alertSrvSpy.handlerAlerta).toHaveBeenCalledWith('Editar Laboratorio', 'Datos Actualizados', 'success');
    }));

    
    it('should call editarResultado, handle error in editar mode with valid form', fakeAsync(() => {
      spyOn(console, 'log');
      const mockError = new Error('Error');
      laboratorioSrvSpy.editarResultado.and.returnValue(throwError(() => mockError));
      const testDate = new Date('2025-12-07T12:00:00');
      const expectedFormattedDate = DateTime.fromJSDate(testDate).toFormat("yyyy-MM-dd'T'HH:mm:ss");
      component.formResultado.setValue({
        fechaAnalisis: testDate,
        nombreAnalisis: 'Ana123',
        resultado: 'Res123',
        observaciones: 'Obs123',
        idLaboratorio: 1
      });
      component.agregarEditarResultado();
      tick();
      expect(laboratorioSrvSpy.editarResultado).toHaveBeenCalledWith(1, jasmine.objectContaining({
        nombreAnalisis: 'Ana123',
        resultado: 'Res123',
        observaciones: 'Obs123',
        idLaboratorio: 1,
        fechaAnalisis: expectedFormattedDate
      }));
      expect(console.log).toHaveBeenCalledWith('Error', mockError);
      expect(dialogRefSpy.close).not.toHaveBeenCalled();
      expect(alertSrvSpy.handlerAlerta).not.toHaveBeenCalledWith('Editar Laboratorio', jasmine.any(String), 'success');
    }));
  });
});