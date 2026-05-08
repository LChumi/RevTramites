import {ProductoCorreccion} from '@dtos/producto-correccion';

export interface ProductoObservacion {
  id?: any;
  idBodega: string;
  fecha?: any;
  item: string;
  descripcion: string;
  bulto?: string;
  unidad?: string;
  cxb?: number;

  stock?: number;
  precio?: number;
  precioTotal?: number;

  usuario: string;
  detalle?: string;
  diferencia?: any;

  correccion?: ProductoCorreccion;
}
