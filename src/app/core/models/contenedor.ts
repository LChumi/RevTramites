export interface Contenedor {
  id:           string;
  contenedorId: string;
  usrBloquea:   string;
  bloqueado:    boolean;
  finalizado:   boolean;
  muestras:     boolean;
  productIds:   string[];
  tramiteId:    string;

  startDate:  any;
  startHour:  any;
  endHour:    any;

  startMuestra: any;
  endMuestra:   any;
}
