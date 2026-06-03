import {OpcionFlete} from '@models/embarque/opcion-flete';

export interface CotizacionConsignatario {
  id?:                 any;
  nombreConsignatario: string;
  opciones:            OpcionFlete[];
}
