import {ProductoCorreccion} from '@dtos/producto-correccion';

export interface CorreccionRequest {
  idProducto: string;
  correccion: ProductoCorreccion;
}
