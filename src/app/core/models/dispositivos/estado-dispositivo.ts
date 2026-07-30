// src/app/features/dispositivos/models/estado-dispositivo.ts

export enum EstadoDispositivo {
  DISPONIBLE = 'DISPONIBLE',
  EN_USO = 'EN_USO',
  MANTENIMIENTO = 'MANTENIMIENTO',
  DANADO = 'DANADO',
  BAJA = 'BAJA',
}

interface EstadoMeta {
  label: string;
  value: EstadoDispositivo;
  severity: 'success' | 'info' | 'warning' | 'danger' | 'secondary';
}

export const ESTADOS_DISPOSITIVO: EstadoMeta[] = [
  { label: 'Disponible',     value: EstadoDispositivo.DISPONIBLE,    severity: 'success' },
  { label: 'En uso',         value: EstadoDispositivo.EN_USO,        severity: 'info' },
  { label: 'Mantenimiento',  value: EstadoDispositivo.MANTENIMIENTO, severity: 'warning' },
  { label: 'Dañado',         value: EstadoDispositivo.DANADO,        severity: 'danger' },
  { label: 'Baja',           value: EstadoDispositivo.BAJA,          severity: 'secondary' },
];

export function estadoSeverity(estado: string) {
  return ESTADOS_DISPOSITIVO.find(e => e.value === estado)?.severity ?? 'secondary';
}

export function estadoLabel(estado: string) {
  return ESTADOS_DISPOSITIVO.find(e => e.value === estado)?.label ?? estado;
}
