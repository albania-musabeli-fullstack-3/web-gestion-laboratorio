import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  
  handlerAlerta(title: string, text: string, icon: SweetAlertIcon) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon
    });
  }


  confirmar(
    title: string = '¿Estás seguro?',
    text: string = 'Esta acción no se puede deshacer',
    confirmButtonText: string = 'Sí, continuar',
    cancelButtonText: string = 'Cancelar'
  ): Promise<boolean> {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText,
      cancelButtonText,
      reverseButtons: true,
    }).then((result: SweetAlertResult) => {
      return result.isConfirmed;
    });
  }

}