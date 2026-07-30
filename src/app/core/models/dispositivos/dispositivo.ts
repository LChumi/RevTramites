export interface Dispositivo {
  id:           string;
  serial:       string;
  marca:        string;
  modelo:       string;
  categoria:    string;
  fechaCompra:  any;
  estadoActual: string;
  ubicacion:    string;
  activo:       boolean;
  creadoPor:    null;
  createdAt:    string;
  updatedAt:    null;
}
