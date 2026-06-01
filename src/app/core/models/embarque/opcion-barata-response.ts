import {OpcionFlete} from '@models/embarque/opcion-flete';

export interface OpcionBarataResponse {
  consignatario: string;
  puerto:        string;
  opcion:        OpcionFlete;
  total:         number;
}
