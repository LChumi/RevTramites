import {Dreposicion} from '@dtos/dreposicion';

export function getEstado(d: Dreposicion | null): string {
  if (!d) return '';
  if (d.cantSol === d.cantApr) return 'COMPLETO';
  if (d.cantSol > d.cantApr) return 'FALTANTE';
  if (d.cantSol < d.cantApr) return 'SOBRANTE';
  return '';
}

export function getSeverity(d: Dreposicion | null): "info" | "success" | "warning" | "danger" | "secondary" | "contrast" | undefined {
  if (!d) return "info";
  if (d.cantSol === d.cantApr) return "success";   // verde
  if (d.cantSol > d.cantApr) return "warning";     // amarillo
  if (d.cantSol < d.cantApr) return "danger";      // rojo
  return "info";
}

export function getEstadoRecepcion(
  d: Dreposicion | null
): string {

  return d?.observacion || '';
}

export function getSeverityRecepcion(
  d: Dreposicion | null
):
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "secondary"
  | "contrast"
  | undefined {

  const estado: string =
    d?.observacion ?? '';

  switch (estado.toUpperCase()) {

    case 'COMPLETO':
      return 'success';

    case 'SOBRANTE':
      return 'danger';

    case 'FALTANTE':
      return 'warning';

    default:
      return 'secondary';
  }
}
