import { Component, inject, OnInit } from '@angular/core';
import { ApiInsumos } from '../../../services/api-insumos/api-insumos';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AlertService } from '../../../../shared/services/alert-service';
import { GestionLab } from '../gestion-lab/gestion-lab';

@Component({
  selector: 'modal-gestion-insumo',
  imports: [
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './gestion-insumo.html'
})
export class GestionInsumo implements OnInit {

  titulo = '';
  nombreBoton = '';

  private readonly fb = inject(FormBuilder);

  private readonly dialogRef = inject(MatDialogRef<GestionLab>);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly insumoSrv = inject(ApiInsumos);
  private readonly alertSrv = inject(AlertService);


  ngOnInit() {
    this.titulo = this.data.editar ? 'Editar Insumo' : 'Agregar Insumo';
    this.nombreBoton = this.data.editar ? 'Editar Insumo' : 'Agregar Insumo';
  }


  formInsumo = this.fb.group({
    nombre: [this.data?.insumo?.nombre || '', [Validators.required]],
    precio: [this.data?.insumo?.precio || '', [Validators.required]],
    cantidad: [this.data?.insumo?.cantidad || '', [Validators.required]]
  })


  private agregarInsumoModal() {
    if (this.formInsumo.valid) {
      const request = this.formInsumo.value;

      this.insumoSrv.crearInsumo(request).subscribe({
        next: (res) => {
          console.log(res);
          this.dialogRef.close({ status: true });
          this.alertSrv.handlerAlerta('Solicitud Exitosa', 'Insumo Agregado', 'success');
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }



  private editarInsumoModal(){
    if (this.formInsumo.valid) {
      const request = this.formInsumo.value;
      const id = this.data.insumo.id;

      this.insumoSrv.editarInsumo(id, request).subscribe({
        next: (res) => {
          this.dialogRef.close({status: true});
          this.alertSrv.handlerAlerta('Editar Insumo', 'Datos actualizados', 'success');
        },
        error: (error) => {
          console.log(error);
          
        }
      })
    }
  }



  agregarEditarInsumo() {
    const { nombre, precio, cantidad } = this.formInsumo.value;
    if (nombre.length < 3) {
      this.alertSrv.handlerAlerta('Advertencia', 'El nombre del insumo debe tener al menos 3 caracteres', 'warning');
      return;
    }
    if (precio <= 0) {
      this.alertSrv.handlerAlerta('Advertencia', 'El precio debe ser un número positivo', 'warning');
      return;
    }
    if (cantidad <= 0) {
      this.alertSrv.handlerAlerta('Advertencia', 'La cantidad debe ser mayor o igual a 0', 'warning');
      return;
    }

    if (this.data.editar) {
      this.editarInsumoModal();
    }
    else {
      this.agregarInsumoModal();
    }
  }


  



}