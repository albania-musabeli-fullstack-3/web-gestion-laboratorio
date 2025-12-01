import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiLaboratorio } from '../../../services/api-laboratorio/api-laboratorio';
import { AlertService } from '../../../../shared/services/alert-service';
import { regexPattern } from '../../../../shared/utils/validations/regex.validation';

@Component({
  selector: 'modal-gestion-lab',
  imports: [
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './gestion-lab.html',
  styleUrl: './gestion-lab.scss',
})
export class GestionLab implements OnInit {

  titulo = '';
  nombreBoton = '';

  private fb = inject(FormBuilder);

  private dialogRef = inject(MatDialogRef<GestionLab>);
  private data = inject(MAT_DIALOG_DATA);
  private laboratorioSrv = inject(ApiLaboratorio);
  private alertSrv = inject(AlertService);
  

  ngOnInit(){
    this.titulo = this.data.editar ? 'Editar Laboratorio' : 'Agregar Laboratorio';
    this.nombreBoton = this.data.editar ? 'Editar Laboratorio' : 'Agregar Laboratorio';
  }
  

  formLaboratorio = this.fb.group({
    nombre: [this.data?.laboratorio?.nombre || '', [Validators.required]],
    direccion: [this.data?.laboratorio?.direccion || '', [Validators.required]],
    telefono: [this.data?.laboratorio?.telefono || '', [Validators.required, Validators.pattern(regexPattern.TELEFONO)]],
    correo: [this.data?.laboratorio?.correo || '', [Validators.required, Validators.pattern(regexPattern.EMAIL)]],
    especialidad: [this.data?.laboratorio?.especialidad || '', [Validators.required]]
  })


  private agregarLabModal(){
    if (this.formLaboratorio.valid) {
      const request = this.formLaboratorio.value;
      this.laboratorioSrv.createLaboratorio(request).subscribe({
        next: (res) => {
          console.log(res);
          this.dialogRef.close({status: true});
          this.alertSrv.handlerAlerta('Solicitud Exitosa', 'Laboratorio Agregado', 'success');
          
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }

  private editarLabModal(){
    if (this.formLaboratorio.valid) {
      const request = this.formLaboratorio.value;
      const id = this.data.laboratorio.id;

      this.laboratorioSrv.editarLaboratorio(id, request).subscribe({
        next: (res) =>{
          this.dialogRef.close({status: true});
          this.alertSrv.handlerAlerta('Editar Laboratorio', 'Datos actualizados', 'success');
        },
        error: (error) => {

        }
      })
    }
  }


  agregarEditarLab(){
    //validar campos del formulario
    const {correo, direccion, especialidad, nombre, telefono} = this.formLaboratorio.value;
    if (nombre.length < 5) {
      this.alertSrv.handlerAlerta('Advertencia', 'El nombre debe tener al menos 5 caracteres', 'warning');
      return;
    }
    if (direccion.length < 5) {
      this.alertSrv.handlerAlerta('Advertencia', 'La dirección debe tener al menos 5 caracteres', 'warning');
      return;
    }
    if (telefono.length < 5) {
      this.alertSrv.handlerAlerta('Advertencia', 'El teléfono debe tener al menos 9 dígitos', 'warning');
      return;
    }
    if (correo.length < 5) {
      this.alertSrv.handlerAlerta('Advertencia', 'El correo debe tener al menos 5 caracteres', 'warning');
      return;
    }
    if (especialidad.length < 5) {
      this.alertSrv.handlerAlerta('Advertencia', 'La especialidad debe tener al menos 5 caracteres', 'warning');
      return;
    }
    

    if (this.data.editar) {
      //modo editar
      this.editarLabModal();

    }
    else {
      // modo agregar
      this.agregarLabModal();
    }
  }


}
