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
  templateUrl: './gestion-result.html',
  styleUrl: './gestion-result.scss',
})
export class GestionResult implements OnInit {

  titulo = '';
  nombreBoton = '';

  // array con laboratorios para select
  laboratorios = signal<Laboratorio[]>([]);


  private fb = inject(FormBuilder);
  private data = inject(MAT_DIALOG_DATA);
  private laboratorioSrv = inject(ApiLaboratorio);
  private alertSrv = inject(AlertService);


  private dialogRef = inject(MatDialogRef<GestionResult>);


  ngOnInit() {
    this.titulo = this.data.editar ? 'Editar Resultado' : 'Agregar Resultado';
    this.nombreBoton = this.data.editar ? 'Editar Resultado' : 'Agregar Resultado';
    this.listarLaboratorios();
  }


  formResultado = this.fb.group({
    fechaAnalisis: [null, [Validators.required]],
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
        a.nombre!.localeCompare(b.nombre!, 'es', { sensitivity: 'base' }) );
        this.laboratorios.set(laboratoriosFormated);
      },
      error: (error) => {
        console.log(error);
        
      }
    })
  }



  agregarEditarResultado() {
    const fechaFormateada = this.formResultado.controls.fechaAnalisis.value!;
    const dt = DateTime.fromJSDate(fechaFormateada).toFormat("yyyy-MM-dd'T'HH:mm:ss");

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
      this.editarResultado();

    }
    else {
      // modo agregar
      this.agregarResultado();
    }
 
  }



  private agregarResultado(){
    if (this.formResultado.valid) {
      const request = {
        //...this.formResultado.value,
        nombreAnalisis: this.formResultado.controls.nombreAnalisis.value!,
        resultado: this.formResultado.controls.resultado.value!,
        observaciones: this.formResultado.controls.observaciones.value!,
        idLaboratorio: this.formResultado.controls.idLaboratorio.value!,
        fechaAnalisis: DateTime.fromJSDate(this.formResultado.controls.fechaAnalisis.value!).toFormat("yyyy-MM-dd'T'HH:mm:ss")
      }
      this.laboratorioSrv.createResultado(request).subscribe({
        next: (res) => {
          console.log(res);

          this.alertSrv.handlerAlerta('Nuevo resultado agregado', '', 'success')
          this.formResultado.reset();
          this.dialogRef.close();
          
        },
        error: (error) => {
          console.log(error);
          
        }
      })
    }
  }

  private editarResultado(){

  }


  


}