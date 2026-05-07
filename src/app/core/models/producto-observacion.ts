import {ProductoCorreccion} from '@dtos/producto-correccion';

export interface ProductoObservacion {
  id: string;
  idBodega: string;
  fecha: any;
  item: string;
  descripcion: string;
  bulto: string;
  unidad: string;
  cxb: string;

  stock: number;
  precio: number;
  precioTotal: number;

  usuario: string;
  detalle: string;
  diferencia: string;

  correccion: ProductoCorreccion
}
