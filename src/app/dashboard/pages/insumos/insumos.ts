import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Insumo } from '../../interfaces/insumo.interface';
import { ApiInsumos } from '../../services/api-insumos/api-insumos';

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
  templateUrl: './insumos.html',
  styleUrl: './insumos.scss',
})
export default class Insumos implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  insumos: Insumo[] = [];
  dataSource = new MatTableDataSource(this.insumos);
  displayedColumns: string[] = [/*'accion',*/ 'nombre', 'cantidad', 'precio unitario'];


  private readonly insumoSrv = inject(ApiInsumos);



  ngOnInit(){
    this.getAllInsumos();
  }



  getAllInsumos(){
    this.insumoSrv.getAllInsumos().subscribe({
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

}