import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GestionLab } from './gestion-lab';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiLaboratorio } from '../../../services/api-laboratorio/api-laboratorio';
import { AlertService } from '../../../../shared/services/alert-service';
import { of, throwError } from 'rxjs';


describe('GestionLab Component', () => {
  let component: GestionLab;
  let fixture: ComponentFixture<GestionLab>;
  let laboratorioSrvSpy: jasmine.SpyObj<ApiLaboratorio>;
  let alertSrvSpy: jasmine.SpyObj<AlertService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<GestionLab>>;
  const mockDataAgregar = { editar: false, laboratorio: null };
  const mockDataEditar = { editar: true, laboratorio: { id: 1, nombre: 'Lab1', direccion: 'Dir1', telefono: '912345678', correo: 'lab@correo.com', especialidad: 'Esp1' } };


  beforeEach(() => {
    laboratorioSrvSpy = jasmine.createSpyObj<ApiLaboratorio>('ApiLaboratorio', ['createLaboratorio', 'editarLaboratorio']);
    alertSrvSpy = jasmine.createSpyObj<AlertService>('AlertService', ['handlerAlerta']);
    dialogRefSpy = jasmine.createSpyObj<MatDialogRef<GestionLab>>('MatDialogRef', ['close']);
  });

  const configureTestBed = (data: any) => async () => {
    await TestBed.configureTestingModule({
      imports: [
        GestionLab,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule
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
    fixture = TestBed.createComponent(GestionLab);
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
      expect(component.titulo).toBe('Agregar Laboratorio');
      expect(component.nombreBoton).toBe('Agregar Laboratorio');
    });


    it('should initialize form with empty values in agregar mode', () => {
      const form = component.formLaboratorio;
      expect(form.controls['nombre'].value).toBe('');
      expect(form.controls['direccion'].value).toBe('');
      expect(form.controls['telefono'].value).toBe('');
      expect(form.controls['correo'].value).toBe('');
      expect(form.controls['especialidad'].value).toBe('');
      expect(form.controls['nombre'].hasValidator(Validators.required)).toBeTrue();
      expect(form.controls['direccion'].hasValidator(Validators.required)).toBeTrue();
      expect(form.controls['telefono'].hasValidator(Validators.required)).toBeTrue();
      expect(form.controls['correo'].hasValidator(Validators.required)).toBeTrue();
      expect(form.controls['especialidad'].hasValidator(Validators.required)).toBeTrue();

      form.patchValue({ telefono: 'abc' });
      expect(form.controls['telefono'].invalid).toBeTrue();
      expect(form.controls['telefono'].errors?.['pattern']).toBeTruthy();
      form.patchValue({ telefono: '912345678' });
      expect(form.controls['telefono'].errors).toBeNull();
      form.patchValue({ correo: 'invalid' });
      expect(form.controls['correo'].invalid).toBeTrue();
      expect(form.controls['correo'].errors?.['pattern']).toBeTruthy();
      form.patchValue({ correo: 'test@correo.com' });
      expect(form.controls['correo'].errors).toBeNull();
    });


    it('should alert if nombre < 5 chars', () => {
      component.formLaboratorio.setValue({ nombre: 'Lab', direccion: 'Dir12345', telefono: '912345678', correo: 'test@correo.com', especialidad: 'Esp12345' });
      component.agregarEditarLab();
      expect(alertSrvSpy.handlerAlerta).toHaveBeenCalledWith('Advertencia', 'El nombre debe tener al menos 5 caracteres', 'warning');
      expect(laboratorioSrvSpy.createLaboratorio).not.toHaveBeenCalled();
    });


    it('should alert if direccion < 5 chars', () => {
      component.formLaboratorio.setValue({ nombre: 'Lab12345', direccion: 'Dir', telefono: '912345678', correo: 'test@correo.com', especialidad: 'Esp12345' });
      component.agregarEditarLab();
      expect(alertSrvSpy.handlerAlerta).toHaveBeenCalledWith('Advertencia', 'La dirección debe tener al menos 5 caracteres', 'warning');
      expect(laboratorioSrvSpy.createLaboratorio).not.toHaveBeenCalled();
    });


    it('should alert if telefono < 5 chars', () => {
      component.formLaboratorio.setValue({ nombre: 'Lab12345', direccion: 'Dir12345', telefono: '1234', correo: 'test@correo.com', especialidad: 'Esp12345' });
      component.agregarEditarLab();
      expect(alertSrvSpy.handlerAlerta).toHaveBeenCalledWith('Advertencia', 'El teléfono debe tener al menos 9 dígitos', 'warning');
      expect(laboratorioSrvSpy.createLaboratorio).not.toHaveBeenCalled();
    });


    it('should alert if correo < 5 chars', () => {
      component.formLaboratorio.setValue({ nombre: 'Lab12345', direccion: 'Dir12345', telefono: '912345678', correo: 'test', especialidad: 'Esp12345' });
      component.agregarEditarLab();
      expect(alertSrvSpy.handlerAlerta).toHaveBeenCalledWith('Advertencia', 'El correo debe tener al menos 5 caracteres', 'warning');
      expect(laboratorioSrvSpy.createLaboratorio).not.toHaveBeenCalled();
    });


    it('should alert if especialidad < 5 chars', () => {
      component.formLaboratorio.setValue({ nombre: 'Lab12345', direccion: 'Dir12345', telefono: '912345678', correo: 'test@correo.com', especialidad: 'Esp' });
      component.agregarEditarLab();
      expect(alertSrvSpy.handlerAlerta).toHaveBeenCalledWith('Advertencia', 'La especialidad debe tener al menos 5 caracteres', 'warning');
      expect(laboratorioSrvSpy.createLaboratorio).not.toHaveBeenCalled();
    });


    it('should not call createLaboratorio if form invalid (e.g., bad pattern) in agregar mode', () => {
      component.formLaboratorio.setValue({ nombre: 'Lab12345', direccion: 'Dir12345', telefono: 'invalidtel', correo: 'test@correo.com', especialidad: 'Esp12345' }); // length ok, pattern bad
      component.agregarEditarLab();
      expect(laboratorioSrvSpy.createLaboratorio).not.toHaveBeenCalled();
    });


    it('should call createLaboratorio, handle success in agregar mode with valid form', fakeAsync(() => {
      spyOn(console, 'log');
      const mockResponse = { id: 1 };
      laboratorioSrvSpy.createLaboratorio.and.returnValue(of(mockResponse));
      component.formLaboratorio.setValue({ nombre: 'Lab12345', direccion: 'Dir12345', telefono: '912345678', correo: 'test@correo.com', especialidad: 'Esp12345' });
      component.agregarEditarLab();
      tick();
      expect(laboratorioSrvSpy.createLaboratorio).toHaveBeenCalledWith(jasmine.objectContaining({
        nombre: 'Lab12345',
        direccion: 'Dir12345',
        telefono: '912345678',
        correo: 'test@correo.com',
        especialidad: 'Esp12345'
      }));
      expect(console.log).toHaveBeenCalledWith(mockResponse);
      expect(dialogRefSpy.close).toHaveBeenCalledWith({ status: true });
      expect(alertSrvSpy.handlerAlerta).toHaveBeenCalledWith('Solicitud Exitosa', 'Laboratorio Agregado', 'success');
    }));


    it('should call createLaboratorio, handle error in agregar mode with valid form', fakeAsync(() => {
      spyOn(console, 'log');
      const mockError = new Error('Error');
      laboratorioSrvSpy.createLaboratorio.and.returnValue(throwError(() => mockError));
      component.formLaboratorio.setValue({ nombre: 'Lab12345', direccion: 'Dir12345', telefono: '912345678', correo: 'test@correo.com', especialidad: 'Esp12345' });
      component.agregarEditarLab();
      tick();
      expect(laboratorioSrvSpy.createLaboratorio).toHaveBeenCalledWith(jasmine.objectContaining({
        nombre: 'Lab12345',
        direccion: 'Dir12345',
        telefono: '912345678',
        correo: 'test@correo.com',
        especialidad: 'Esp12345'
      }));
      expect(console.log).toHaveBeenCalledWith(mockError);
      expect(dialogRefSpy.close).not.toHaveBeenCalled();
      expect(alertSrvSpy.handlerAlerta).not.toHaveBeenCalledWith('Solicitud Exitosa', jasmine.any(String), 'success');
    }));
  });


  describe('in editar mode', () => {
    beforeEach(configureTestBed(mockDataEditar));

    it('should set title and button for editar mode', () => {
      component.ngOnInit();
      expect(component.titulo).toBe('Editar Laboratorio');
      expect(component.nombreBoton).toBe('Editar Laboratorio');
    });


    it('should initialize form with laboratorio values in editar mode', () => {
      const form = component.formLaboratorio;
      expect(form.controls['nombre'].value).toBe('Lab1');
      expect(form.controls['direccion'].value).toBe('Dir1');
      expect(form.controls['telefono'].value).toBe('912345678');
      expect(form.controls['correo'].value).toBe('lab@correo.com');
      expect(form.controls['especialidad'].value).toBe('Esp1');
    });


    it('should not call editarLaboratorio if form invalid (e.g., bad pattern) in editar mode', () => {
      component.formLaboratorio.setValue({ nombre: 'Lab12345', direccion: 'Dir12345', telefono: 'invalidtel', correo: 'test@correo.com', especialidad: 'Esp12345' }); // length ok, pattern bad
      component.agregarEditarLab();
      expect(laboratorioSrvSpy.editarLaboratorio).not.toHaveBeenCalled();
    });


    it('should call editarLaboratorio, handle success in editar mode with valid form', fakeAsync(() => {
      const mockResponse = { id: 1 };
      laboratorioSrvSpy.editarLaboratorio.and.returnValue(of(mockResponse));
      component.formLaboratorio.setValue({ nombre: 'Lab12345', direccion: 'Dir12345', telefono: '912345678', correo: 'test@correo.com', especialidad: 'Esp12345' });
      component.agregarEditarLab();
      tick();
      expect(laboratorioSrvSpy.editarLaboratorio).toHaveBeenCalledWith(1, jasmine.objectContaining({
        nombre: 'Lab12345',
        direccion: 'Dir12345',
        telefono: '912345678',
        correo: 'test@correo.com',
        especialidad: 'Esp12345'
      }));
      expect(dialogRefSpy.close).toHaveBeenCalledWith({ status: true });
      expect(alertSrvSpy.handlerAlerta).toHaveBeenCalledWith('Editar Laboratorio', 'Datos actualizados', 'success');
    }));

    
    it('should call editarLaboratorio, handle error in editar mode with valid form', fakeAsync(() => {
      const mockError = new Error('Error');
      laboratorioSrvSpy.editarLaboratorio.and.returnValue(throwError(() => mockError));
      component.formLaboratorio.setValue({ nombre: 'Lab12345', direccion: 'Dir12345', telefono: '912345678', correo: 'test@correo.com', especialidad: 'Esp12345' });
      component.agregarEditarLab();
      tick();
      expect(laboratorioSrvSpy.editarLaboratorio).toHaveBeenCalledWith(1, jasmine.objectContaining({
        nombre: 'Lab12345',
        direccion: 'Dir12345',
        telefono: '912345678',
        correo: 'test@correo.com',
        especialidad: 'Esp12345'
      }));
      expect(dialogRefSpy.close).not.toHaveBeenCalled();
      expect(alertSrvSpy.handlerAlerta).not.toHaveBeenCalledWith('Editar Laboratorio', jasmine.any(String), 'success');
    }));
  });
});