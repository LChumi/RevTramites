export interface DashboardResumen {
  totalObservaciones: number;
  conCorreccion: number;
  sinCorreccion: number;
  totalValorAfectado: number;
}

export interface ObservacionPorBodega {
  idBodega: number;
  total: number;
  corregidos: number;
  pendientes: number;
}

export interface ObservacionPorMes {
  mes: number;
  total: number;
  corregidos: number;
}

export interface TopProducto {
  id: string;
  descripcion: string;
  total: number;
}
