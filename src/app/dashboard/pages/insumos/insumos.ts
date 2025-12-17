import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Insumo } from '../../interfaces/insumo.interface';
import { ApiInsumos } from '../../services/api-insumos/api-insumos';
import { AlertService } from '../../../shared/services/alert-service';
import { GestionInsumo } from '../../components/modals/gestion-insumo/gestion-insumo';

@Component({
  selector: 'app-insumos',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatPaginatorModule,
  ],
  templateUrl: './insumos.html'
})
export default class Insumos implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  insumos: Insumo[] = [];
  dataSource = new MatTableDataSource(this.insumos);
  displayedColumns: string[] = ['accion', 'nombre', 'cantidad', 'precio unitario'];


  private readonly insumoSrv = inject(ApiInsumos);
  private readonly dialog = inject(MatDialog);
  private readonly alertSrv = inject(AlertService);



  ngOnInit(){
    this.getAllInsumos();
  }


  getAllInsumos(){
    this.insumoSrv.listarInsumos().subscribe({
      next: (res) => {
        const insumos = res.sort((a, b) => b.id! - a.id!)
        this.dataSource.data = insumos;
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        console.log(error);
        
      }
    })
  }

  async eliminarInsumo(row: Insumo){
    const confirmado = await this.alertSrv.confirmar(
      'Eliminar Resultado',
      `Está a punto de eliminar ${row.nombre}. Esta acción no se puede deshacer.`,
      'Sí, eliminar',
      'Cancelar'
    );

    if (confirmado) {
      this.insumoSrv.eliminarInsumo(row.id!).subscribe({
        next: () => {
          this.alertSrv.handlerAlerta('Eliminado', 'El insumo ha sido eliminado', 'success');
          this.getAllInsumos();
        },
        error: (error) => {
          console.log('Error', error);
          
        }
      })
    }
  }


  openModalAgregarEditarInsumo(row: Insumo | null = null, editar: boolean = false){
    this.dialog.open(GestionInsumo, {
          width: '800px',
          maxWidth: '95vw',
          autoFocus: false,
          disableClose: false,
          data: {
            insumo: row,
            editar
          }
        }).afterClosed().subscribe(result => {
          if (result?.status) {
            this.getAllInsumos();
          }
        })
  }

}