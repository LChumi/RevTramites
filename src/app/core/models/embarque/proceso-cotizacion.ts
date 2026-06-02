export interface ProcesoCotizacion {
  id?:               any;
  numeroReferencia: string;
  tipoReferencia:   string;
  empresaId:        string;
  proveedorId:      string;
  estado?:           string;
  creadoEn?:         Date;
}
