export interface TramiteEmbarque {
  id:                     string;
  ordenLlegada:           string;
  empresaId:              string;
  numeroTramite:          string;
  proveedorId:            string;
  numeroBl:               string;
  cantidadContenedores:   string;
  fleteValidadoId:        string;
  consignatario:          string;
  fechaEmbarque:          Date;
  fechaArribo:            Date;
  diasLibres:             number;
  puertoSalida:           string;
  puertoLlegada:          string;
  solicitudNEcuapass:     string;
  fechaSolicitudEcuapass: Date;
  identificar:            string;
  solicitudNIntertek:     string;
  preLiquidacion:         string;
  polizaNChub:            string;
  creadoEn:               Date;
  actualizadoEn:          Date;
  estado:                 string;
}

