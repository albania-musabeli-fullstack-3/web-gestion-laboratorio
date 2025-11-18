export interface DashboarItem {
    label: string;
    icon: string;
    link?: string;
    submenu?: Submenu[]
}

export interface Submenu {
    label: string;
    link: string;
    codPrograma: string;
    nombrePrograma: string;
}