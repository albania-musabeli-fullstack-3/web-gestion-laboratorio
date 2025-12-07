import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiLaboratorio } from '../../../services/api-laboratorio/api-laboratorio';
import { AlertService } from '../../../../shared/services/alert-service';
import { Laboratorio } from '../../../interfaces/laboratorio.interface';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DateTime } from 'luxon';

@Component({
  selector: 'modal-gestion-result',
  imports: [
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './gestion-result.html'
})
export class GestionResult implements OnInit {

  titulo = '';
  nombreBoton = '';

  // array con laboratorios para select
  laboratorios = signal<Laboratorio[]>([]);


  private readonly fb = inject(FormBuilder);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly laboratorioSrv = inject(ApiLaboratorio);
  private readonly alertSrv = inject(AlertService);


  private readonly dialogRef = inject(MatDialogRef<GestionResult>);


  ngOnInit() {
    this.titulo = this.data.editar ? 'Editar Resultado' : 'Agregar Resultado';
    this.nombreBoton = this.data.editar ? 'Editar Resultado' : 'Agregar Resultado';
    this.listarLaboratorios();

    if (this.data.editar) {
      this.cargarFormularioEdit()
    }
  }


  cargarFormularioEdit(){
    console.log('Datos row desde el padre', this.data);

    const fechaResultado = this.data.resultado.fechaAnalisis;
    const fechaResultadoJS = DateTime.fromFormat(fechaResultado, 'dd/MM/yyyy').toJSDate();
    
    this.formResultado.patchValue({
    fechaAnalisis: fechaResultadoJS,
    nombreAnalisis: this.data.resultado.nombreAnalisis,
    idLaboratorio: this.data.resultado.laboratorio.id,
    resultado: this.data.resultado.resultado,
    observaciones: this.data.resultado.observaciones,
  });
  }


  formResultado = this.fb.group({
    fechaAnalisis: [null as Date | null, [Validators.required]],
    nombreAnalisis: ['', [Validators.required]],
    resultado: ['', [Validators.required]],
    observaciones: ['', [Validators.required]],
    idLaboratorio: [null, [Validators.required]]
  })


  listarLaboratorios(){
    this.laboratorioSrv.getAllLaboratorios().subscribe({
      next: (res) => {
        // laboratorios ordenados alfabeticamente
        const laboratoriosFormated = res.sort((a,b) =>
        a.nombre!.localeCompare(b.nombre as string, 'es', { sensitivity: 'base' }) );
        this.laboratorios.set(laboratoriosFormated);
      },
      error: (error) => {
        console.log(error);
        
      }
    })
  }



  agregarEditarResultado() {
    const {nombreAnalisis, observaciones, resultado} = this.formResultado.value;

    if (nombreAnalisis!.length < 3) {
      this.alertSrv.handlerAlerta('Advertencia', 'El nombre del análisis debe tener al menos 3 caracteres', 'warning');
      return;
    }
    if (observaciones!.length > 1000) {
      this.alertSrv.handlerAlerta('Advertencia', 'Las observaciones no pueden exceder a 1000 caracteres', 'warning');
      return;
    }
    if (resultado!.length < 3) {
      this.alertSrv.handlerAlerta('Advertencia', 'El resultado debe tener al menos 3 caracteres', 'warning');
      return;
    }


    if (this.data.editar) {
      //modo editar
      this.editarResultadoModal();

    }
    else {
      // modo agregar
      this.agregarResultadoModal();
    }
  }



  private agregarResultadoModal(){
    if (this.formResultado.valid) {

      const fechaAnalisis = this.formResultado.controls.fechaAnalisis.value as Date;

      const request = {
        nombreAnalisis: this.formResultado.controls.nombreAnalisis.value!,
        resultado: this.formResultado.controls.resultado.value!,
        observaciones: this.formResultado.controls.observaciones.value!,
        idLaboratorio: this.formResultado.controls.idLaboratorio.value!,
        fechaAnalisis: DateTime.fromJSDate(fechaAnalisis).toFormat("yyyy-MM-dd'T'HH:mm:ss")
      }
      this.laboratorioSrv.createResultado(request).subscribe({
        next: (res) => {
          console.log(res);
          this.dialogRef.close({status: true});
          this.alertSrv.handlerAlerta('Nuevo resultado agregado', '', 'success')
        },
        error: (error) => {
          console.log('Error', error);
        }
      })
    }
  }



  private editarResultadoModal(){
    if (this.formResultado.valid) {

      const fechaAnalisis = this.formResultado.controls.fechaAnalisis.value as Date;

      const request = {
        //...this.formResultado.value,
        nombreAnalisis: this.formResultado.controls.nombreAnalisis.value!,
        resultado: this.formResultado.controls.resultado.value!,
        observaciones: this.formResultado.controls.observaciones.value!,
        idLaboratorio: this.formResultado.controls.idLaboratorio.value!,
        fechaAnalisis: DateTime.fromJSDate(fechaAnalisis).toFormat("yyyy-MM-dd'T'HH:mm:ss")
      }
      const id = this.data.resultado.id;

      this.laboratorioSrv.editarResultado(id, request).subscribe({
        next: (res) => {
          this.dialogRef.close({status: true});
          this.alertSrv.handlerAlerta('Editar Laboratorio', 'Datos Actualizados', 'success');
        },
        error: (error) => {
          console.log('Error', error);
          
        }
      })
    }
  }


  


}