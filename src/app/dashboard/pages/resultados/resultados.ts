import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ResultadosLabRes } from '../../interfaces/laboratorio.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiLaboratorio } from '../../services/api-laboratorio/api-laboratorio';
import { GestionResult } from '../../components/modals/gestion-result/gestion-result';
import { AlertService } from '../../../shared/services/alert-service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-resultados',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatPaginatorModule,
  ],
  templateUrl: './resultados.html'
})
export default class Resultados implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  resultadosLab: ResultadosLabRes[] = [];
  dataSource = new MatTableDataSource(this.resultadosLab);
  displayedColumns: string[] = ['accion', 'fechaAnalisis', 'nombreAnalisis', 'resultado', 'observaciones', 'nombreLab'];

  private readonly laboratorioSrv = inject(ApiLaboratorio);
  private readonly dialog = inject(MatDialog);
  private readonly alertSrv = inject(AlertService);
  


  ngOnInit(): void {
    this.getAllResultados();
  }

  // modal resultados
  openModalAgregarEditarResultado(row: ResultadosLabRes | null = null, editar: boolean = false) {
    this.dialog.open(GestionResult, {
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

        // ordenar por id descendente
        resultados.sort((a,b) => (b.id ?? 0) - (a.id ?? 0));

        this.dataSource = new MatTableDataSource(resultados);
        this.dataSource.paginator = this.paginator;

      },
      error: (error) => {
        console.log('Error', error);

      }
    })
  }

  

  async eliminarAnalisisLab(row: ResultadosLabRes) {
     const confirmado = await this.alertSrv.confirmar(
      'Eliminar Resultado',
      `Está a punto de eliminar ${row.nombreAnalisis}. Esta acción no se puede deshacer.`,
      'Sí, eliminar',
      'Cancelar'
    );

    if (confirmado) {
      this.laboratorioSrv.eliminarResultado(row.id).subscribe({
        next: () => {
          this.alertSrv.handlerAlerta('Eliminado', 'El resultado ha sido eliminado', 'success');
          this.getAllResultados();
        },
        error: (error) => {
          console.log('Error', error);
        }
      })
    }
  }


}
