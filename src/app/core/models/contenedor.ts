import {Producto} from '@models/producto';

export interface Contenedor {
  id:         string;
  usrBloquea: string;
  bloqueado:  boolean;
  finalizado: boolean;
  productos:  Producto[];
}
