import {CotizacionConsignatario} from '@models/embarque/cotizacion-consignatario';

export interface SalidaBuque {
  id:                   any;
  procesoCotizacionId:  string;
  puertoEmbarqueNombre: string;
  fechaDesde:           Date;
  fechaHasta:           Date;
  diasLibres:           number;
  cotizacion:         CotizacionConsignatario;
  activo:               boolean;
  creadoEn:             Date;
  actualizadoEn:        Date;
}
