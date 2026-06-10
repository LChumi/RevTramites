export interface OpcionFlete {
  id?:                any;
  tipoContenedor:     string;
  espacioM3:          number;
  puertoDestino:      string;
  flete:              number;
  thc:                number;
  imo:                number;
  gastosBl:           number;
  handlingContenedor: number;
  numeroBl:           string;
  porcentajeIva:      number;
  ivaBl:              number;
  subtotalFlete:      number;
  ivaHandling:        number;
  total:              number;
  subtotalGastos:     number;
  nContenedores:      number;
}
