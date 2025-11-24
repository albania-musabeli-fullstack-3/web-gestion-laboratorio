import { Component, inject, OnInit } from '@angular/core';
import { LaboratorioApi } from '../../services/laboratorio-api/laboratorio-api';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { LaboratorioRes } from '../../interfaces/laboratorio.response';

@Component({
  selector: 'app-laboratorios',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './laboratorios.html',
  styleUrl: './laboratorios.scss',
})
export default class Laboratorios implements OnInit {

  laboratorios: LaboratorioRes[] = [];
  dataSource = new MatTableDataSource(this.laboratorios);
  displayedColumns: string[] = ['accion', 'nombre', 'direccion', 'telefono', 'correo', 'especialidad'];

  private laboratorioSrv = inject(LaboratorioApi);

  ngOnInit(): void {
    this.getAllLaboratorios()
  }


  getAllLaboratorios(){
    this.laboratorioSrv.getAllLaboratorios().subscribe({
      next: (res) => {
        console.log(res);
        this.dataSource = new MatTableDataSource(res);
      },
      error: (error) => {
        console.log(error);
        
      }
    })
  }

  agregarLaboratorio(){
    
  }


  editarLaboratorio(row: LaboratorioRes){

  }


  eliminarLaboratorio(row: LaboratorioRes){

  }


}