import { TestBed } from '@angular/core/testing';
import { AlertService } from './alert-service';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

describe('AlertService', () => {
  
  let service: AlertService;
  let swalFireSpy: jasmine.Spy;

  beforeEach(() => {
    swalFireSpy = spyOn(Swal, 'fire');

    TestBed.configureTestingModule({
      providers: [AlertService]
    });

    service = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('handlerAlerta', () => {
    it('should call Swal.fire with correct title, text and icon', () => {
      const title = 'Operación exitosa';
      const text = 'Los datos se guardaron correctamente';
      const icon: SweetAlertIcon = 'success';

      service.handlerAlerta(title, text, icon);

      expect(swalFireSpy).toHaveBeenCalledWith({
        title,
        text,
        icon
      });
      expect(swalFireSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('confirmar', () => {
    it('should use default values when no parameters are provided', () => {
      service.confirmar();

      expect(swalFireSpy).toHaveBeenCalledWith({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
      });
    });

    it('should use custom values when parameters are provided', () => {
      service.confirmar('Eliminar usuario', 'No podrás recuperarlo', 'Sí, eliminar', 'Cancelar');

      expect(swalFireSpy).toHaveBeenCalledWith({
        title: 'Eliminar usuario',
        text: 'No podrás recuperarlo',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
      });
    });

    it('should resolve to true when user confirms', async () => {
      // Simular que Swal devuelve una promesa que resuelve con isConfirmed: true
      const mockResult: SweetAlertResult = { isConfirmed: true } as SweetAlertResult;
      swalFireSpy.and.returnValue(Promise.resolve(mockResult));

      const result = await service.confirmar();
      expect(result).toBeTrue();
    });

    it('should resolve to false when user cancels or dismisses', async () => {
      // Simular cancelación
      const mockResult: SweetAlertResult = { isConfirmed: false } as SweetAlertResult;
      swalFireSpy.and.returnValue(Promise.resolve(mockResult));

      const result = await service.confirmar();
      expect(result).toBeFalse();
    });

    it('should resolve to false when dialog is dismissed (e.g. ESC key)', async () => {
      // Simular dismiss
      const mockResult: SweetAlertResult = { isDismissed: true } as SweetAlertResult;
      swalFireSpy.and.returnValue(Promise.resolve(mockResult));

      const result = await service.confirmar();
      expect(result).toBeFalse();
    });
  });
});