export interface LaboratorioRes {
    id:           number;
    nombre:       string;
    direccion:    string;
    telefono:     string;
    correo:       string;
    especialidad: string;
}


export interface ResultadosLabRes {
    id:             number;
    fechaAnalisis:  string;
    nombreAnalisis: string;
    resultado:      string;
    observaciones:  string;
    laboratorio:    LaboratorioRes;
    nombreLab?:     string;
}

