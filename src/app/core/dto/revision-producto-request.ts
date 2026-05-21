export interface RevisionProductoRequest {
  barra:       string;
  creposicion: number;
  empresa:     number;
  usuario:     string;
  cantidad?:    any;
  shouldAdd:   boolean;
}
