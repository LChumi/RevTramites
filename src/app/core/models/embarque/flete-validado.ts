export interface FleteValidado {
  id:                      string;
  procesoCotizacionId:     string;
  salidaBuqueId:           string;
  consignatarioId:         string;
  nombreConsignatario:     string;
  puertoEmbarqueNombre:    string;
  tipoContenedor:          string;
  nContenedores:           number;
  puertoDestino:           string;
  espacioM3:               number;
  flete:                   number;
  thc:                     number;
  imo:                     number;
  gastosBlTotal:           number;
  handlingContenedorTotal: number;
  total:                   number;
  estado:                  string;
  motivoAnulacion:         string;
  fleteReemplazadoPorId:   string;
  validadoPor:             string;
  fechaValidacion:         Date;
}
