import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Insumo } from '../../interfaces/insumo.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiInsumos {

  private readonly http = inject(HttpClient);
  private readonly urlBaseAPI = 'http://localhost:8082/api';


  listarInsumos(){
    return this.http.get<Insumo[]>(`${this.urlBaseAPI}/insumo`);
  }


  eliminarInsumo(id: number){
    return this.http.delete<Insumo>(`${this.urlBaseAPI}/insumo/${id}`);
  }


  crearInsumo(request: Insumo){
    return this.http.post<Insumo>(`${this.urlBaseAPI}/insumo`, request);
  }


  editarInsumo(id: number, request: Insumo){
    return this.http.put<Insumo>(`${this.urlBaseAPI}/insumo/${id}`, request);
  }
  
}
