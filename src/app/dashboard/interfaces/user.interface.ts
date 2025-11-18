export interface User {
    id: number;
    nombre: string;
    correo: string;
    roles: { id: number; nombre: string }[];
}
