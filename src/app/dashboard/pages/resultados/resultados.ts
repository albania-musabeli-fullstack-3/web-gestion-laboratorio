import { Component, inject, OnInit } from '@angular/core';
import { Laboratorio, ResultadosLabRes } from '../../interfaces/laboratorio.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiLaboratorio } from '../../services/api-laboratorio/api-laboratorio';
import { GestionResult } from '../../components/modals/gestion-result/gestion-result';
import { AlertService } from '../../../shared/services/alert-service';

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
  private dialog = inject(MatDialog);
  private alertSrv = inject(AlertService);
  


  ngOnInit(): void {
    this.getAllResultados();
  }

  // modal resultados
  openModalAgregarEditarResultado(row: ResultadosLabRes | null = null, editar: boolean = false) {
    const dialogRef = this.dialog.open(GestionResult, {
      width: '800px',
      maxWidth: '95vw',
      autoFocus: false,
      disableClose: false,
      data: {
        resultado: row,
        editar
      }
    }).afterClosed().subscribe(result => {
      if (result.status) {
        this.getAllResultados();
      }
    })
  }


  getAllResultados() {
    this.laboratorioSrv.getAllResultadosAnalisis().subscribe({
      next: (res) => {
        console.log(res);
        const resultados = res.map(resultado => ({
          ...resultado,
          fechaAnalisis: resultado.fechaAnalisis.split(' ')[0],
          nombreLab: resultado.laboratorio.nombre
        })) as ResultadosLabRes[]
        this.dataSource = new MatTableDataSource(resultados);
      },
      error: (error) => {
        console.log(error);

      }
    })
  }

  

  async eliminarAnalisisLab(row: ResultadosLabRes) {
     const confirmado = await this.alertSrv.confirmar(
      'Eliminar laboratorio',
      `Está a punto de eliminar ${row.nombreAnalisis}. Esta acción no se puede deshacer.`,
      'Sí, eliminar',
      'Cancelar'
    );

    if (confirmado) {
      this.laboratorioSrv.eliminarResultado(row.id!).subscribe({
        next: () => {
          this.alertSrv.handlerAlerta('Eliminado', 'El resultado ha sido eliminado', 'success');
          this.getAllResultados();
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }


}
