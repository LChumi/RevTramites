export interface ProcesoCotizacion {
  id:               string;
  numeroReferencia: string;
  tipoReferencia:   string;
  empresaId:        string;
  proveedorId:      string;
  estado:           string;
  creadoEn:         Date;
}
