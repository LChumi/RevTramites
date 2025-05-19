export interface Contenedor {
  id:         string;
  usrBloquea: string;
  bloqueado:  boolean;
  finalizado: boolean;
  productIds: string[];
  tramiteId:  string;

  startDate:  any;
  startHour:  any;
  endHour:    any;
}
