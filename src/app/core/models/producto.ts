export interface Producto {
  id:              string;
  barcode:         string;
  contenedorId:    string;
  tramiteId:       string;

  id1:             string;
  nombre:          string;
  cxb:             number;
  bultos:          number;
  total:           number;
  itemAlterno:     number;
  pvp:             number;
  cxbAnterior:     number;
  ubicacionBulto:  string;
  ubicacionUnidad: string;
  stockZhucay:     number;
  stockNarancay:   number;
  descripcion:     string;
  barraSistema:    string;
  diferencia:      number;
  secuencia:       number;

  //Datos revision
  cantidadRevision:           number;
  cantidadDiferenciaRevision: number;
  estadoRevision:             string;
  usuarioRevision:            string;
  historialRevision:          string[];

  //Datos Muestras
  barraMuestra:           string;
  cantidadMuestra:        number;
  historialBarrasMuestra: string[];
  procesoMuestra:         string;
  usuarioMuestra:         string;
  statusMuestra:          boolean;
}
