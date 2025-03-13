import {Tramite} from '@models/tramite';

export interface Revision {
  id:                 string;
  barra:              string;
  cantidad:           number;
  fecha:              null;
  hora:               null;
  usuario:            string;
  tramite:            Tramite;
  cantidadPedida:     number;
  cantidadDiferencia: number;
  estado:             string;
  secuencia:          number;
}
