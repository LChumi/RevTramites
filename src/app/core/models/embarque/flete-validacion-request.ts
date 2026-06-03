import {ProcesoCotizacion} from '@models/embarque/proceso-cotizacion';
import {SalidaBuque} from '@models/embarque/salida-buque';
import {Consignatario} from '@models/embarque/consignatario';
import {OpcionFlete} from '@models/embarque/opcion-flete';

export interface FleteValidacionRequest {
  proceso:       ProcesoCotizacion;
  salida:        SalidaBuque;
  consignatario: string;
  opcion:        OpcionFlete;
  usuario:       string;
}
