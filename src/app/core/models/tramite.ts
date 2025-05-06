import {Contenedor} from '@models/contenedor';

export interface Tramite {
  id:           string;
  fechaCarga:   Date;
  fechaLlegada: Date;
  fechaArribo:  Date;
  horaArribo:   any;
  contenedores: Contenedor[];
  proceso:      number;
}
