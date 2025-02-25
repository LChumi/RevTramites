import {Contenedor} from '@models/contenedor';

export interface Tramite {
  id:          string;
  fechaCarga:  Date;
  fechaLlegada:  Date;
  contenedores:  Contenedor[];
  estado: boolean;
}
