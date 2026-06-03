import {OpcionFlete} from '@models/embarque/opcion-flete';

export interface CotizacionConsignatario {
  nombreConsignatario: string;
  opciones:            OpcionFlete[];
}
