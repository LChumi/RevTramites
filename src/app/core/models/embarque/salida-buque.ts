import {CotizacionConsignatario} from '@models/embarque/cotizacion-consignatario';

export interface SalidaBuque {
  id:                   string;
  procesoCotizacionId:  string;
  puertoEmbarqueId:     string;
  puertoEmbarqueNombre: string;
  fechaDesde:           Date;
  fechaHasta:           Date;
  diasLibres:           number;
  naviera:              string;
  tipoServicio:         string;
  cotizaciones:         CotizacionConsignatario[];
  activo:               boolean;
  creadoEn:             Date;
  actualizadoEn:        Date;
}
