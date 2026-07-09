import {ProveedorDTO} from '@dtos/confiteria/proveedor-dto';
import {ProductoDTO} from '@dtos/confiteria/producto-dto';
import {FechaDTO} from '@dtos/confiteria/fecha-dto';

export interface DashboardConfiteriaDTO {
  totalReposiciones: number;
  totalProductos:    number;
  valorTotal:        number;
  proveedores:       ProveedorDTO[];
  topProductos:      ProductoDTO[];
  historial:         FechaDTO[];
}
