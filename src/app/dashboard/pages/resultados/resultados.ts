import { Component, inject, OnInit } from '@angular/core';
import { Laboratorio, ResultadosLabRes } from '../../interfaces/laboratorio.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiLaboratorio } from '../../services/api-laboratorio/api-laboratorio';

@Component({
  selector: 'app-resultados',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './resultados.html',
  styleUrl: './resultados.scss',
})
export default class Resultados implements OnInit {

  resultadosLab: ResultadosLabRes[] = [];
  dataSource = new MatTableDataSource(this.resultadosLab);
  displayedColumns: string[] = ['accion', 'fechaAnalisis', 'nombreAnalisis', 'resultado', 'observaciones', 'nombreLab'];

  private laboratorioSrv = inject(ApiLaboratorio);

  ngOnInit(): void {
    this.getAllResultados();
  }


  getAllResultados() {
    this.laboratorioSrv.getAllResultadosAnalisis().subscribe({
      next: (res) => {
        console.log(res);
        const resultados = res.map(resultado => ({
          ...resultado,
          nombreLab: resultado.laboratorio.nombre
        })) as ResultadosLabRes[]
        this.dataSource = new MatTableDataSource(resultados);
      },
      error: (error) => {
        console.log(error);

      }
    })
  }

  agregarAnalisisLab() {
    
  }


  editarAnalisisLab(row: ResultadosLabRes) {

  }


  eliminarAnalisisLab(row: ResultadosLabRes) {

  }


}
