import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ApiLaboratorio } from '../../services/api-laboratorio/api-laboratorio';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Laboratorio } from '../../interfaces/laboratorio.interface';
import { GestionLab } from '../../components/modals/gestion-lab/gestion-lab';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { AlertService } from '../../../shared/services/alert-service';

@Component({
  selector: 'app-laboratorios',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatPaginatorModule,
  ],
  templateUrl: './laboratorios.html'
})
export default class Laboratorios implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  laboratorios: Laboratorio[] = [];
  dataSource = new MatTableDataSource(this.laboratorios);
  displayedColumns: string[] = ['accion', 'nombre', 'direccion', 'telefono', 'correo', 'especialidad'];

  private readonly laboratorioSrv = inject(ApiLaboratorio);
  private readonly alertSrv = inject(AlertService);
  private readonly dialog = inject(MatDialog);


  ngOnInit(): void {
    this.getAllLaboratorios()
  }


  getAllLaboratorios() {
    this.laboratorioSrv.getAllLaboratorios().subscribe({
      next: (res) => {
        const laboratorios = res.sort((a, b) => b.id! - a.id!)
        this.dataSource.data = laboratorios;
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        console.log(error);

      }
    })
  }

  openModalAgregarEditarLab(row: Laboratorio | null = null, editar: boolean = false) {
    this.dialog.open(GestionLab, {
      width: '800px',
      maxWidth: '95vw',
      autoFocus: false,
      disableClose: false,
      data: {
        laboratorio: row,
        editar
      }
    }).afterClosed().subscribe(result => {
      if (result.status) {
        this.getAllLaboratorios();
      }
    })


  }


  async eliminarLaboratorio(row: Laboratorio) {
    if (!row.id) return;

    const confirmado = await this.alertSrv.confirmar(
      'Eliminar laboratorio',
      `Está a punto de eliminar ${row.nombre}. Esta acción no se puede deshacer.`,
      'Sí, eliminar',
      'Cancelar'
    );

    if (confirmado) {
      this.laboratorioSrv.eliminarLaboratorio(row.id).subscribe({
        next: () => {
          this.alertSrv.handlerAlerta('Eliminado', 'El laboratorio ha sido eliminado', 'success');
          this.getAllLaboratorios();
        },
        error: (err) => {
          console.error(err);
          this.alertSrv.handlerAlerta('Precaución', 'Este laboratorio tiene resultados asociados', 'warning');
        }
      });
    }
  }

}