import {OpcionFlete} from '@models/embarque/opcion-flete';

export interface CotizacionConsignatario {
  consignatarioId:     string;
  nombreConsignatario: string;
  opciones:            OpcionFlete[];
}
