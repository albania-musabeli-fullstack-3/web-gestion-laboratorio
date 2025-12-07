import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Laboratorio, ResultadoReq, ResultadosLabRes } from '../../interfaces/laboratorio.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiLaboratorio {
  
  private readonly http = inject(HttpClient);
  private readonly urlBaseAPI = 'http://localhost:8081/api';


  getAllLaboratorios(){
    return this.http.get<Laboratorio[]>(`${this.urlBaseAPI}/laboratorio`);
  }


  createLaboratorio(request: Laboratorio){
    return this.http.post<Laboratorio>(`${this.urlBaseAPI}/laboratorio`, request);
  }


  getAllResultadosAnalisis(){
    return this.http.get<ResultadosLabRes[]>(`${this.urlBaseAPI}/resultado`);
  }


  editarLaboratorio(id: number, request: Laboratorio){
    return this.http.put<Laboratorio>(`${this.urlBaseAPI}/laboratorio/${id}`, request);
  }


  eliminarLaboratorio(id: number){
    return this.http.delete<Laboratorio>(`${this.urlBaseAPI}/laboratorio/${id}`);
  }


  createResultado(request: ResultadoReq){
    return this.http.post<ResultadosLabRes>(`${this.urlBaseAPI}/resultado` , request);
  }

  
  editarResultado(id: number, request: ResultadoReq){
    return this.http.put<ResultadosLabRes>(`${this.urlBaseAPI}/resultado/${id}`, request);
  }

  eliminarResultado(id: number){
    return this.http.delete<ResultadosLabRes>(`${this.urlBaseAPI}/resultado/${id}`);
  }


}
