export interface Tramite {
  id:               string;
  fechaCarga:       Date;
  fechaLlegada:     Date;
  fechaArribo:      Date;
  horaArribo:       any;
  contenedoresIds:  string[];
  proceso:          number;
}
