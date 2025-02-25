import {Contenedor} from '@models/contenedor';

export interface Tramite {
  id:          string;
  fechaCarga:  Date;
  observacion: string;
  contenedor:  Contenedor;
}
