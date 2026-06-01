export interface OpcionFlete {
  tipoContenedor:     string;
  espacioM3:          number;
  puertoDestino:      string;
  flete:              number;
  thc:                number;
  imo:                number;
  gastosBl:           number;
  handlingContenedor: number;
  porcentajeIva:      number;
  ivaBl:              number;
  subtotalFlete:      number;
  ivaHandling:        number;
  total:              number;
  subtotalGastos:     number;
}
