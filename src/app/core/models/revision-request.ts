export interface RevisionRequest {
  tramiteId:  string;
  contenedor: string;
  barra:      string;
  usuario:    string;
  status:     boolean;
  cantidad:   number;
  cxb:        number;
  obsCxb:     string;
}
