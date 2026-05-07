import {ProductoObservacion} from '@models/producto-observacion';
import {environment} from '@environments/environment';

export function  tieneCorreccion(observacion: ProductoObservacion) {
  const hoy = new Date();
  const fechaObservacion = convertirStringAFecha(observacion.fecha);

  // Si tiene corrección, devolver 'verde'
  if (observacion.correccion !== null) {
    return 'verde';
  }
  // Obtener el primer día del mes actual
  const primerDiaMesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  // Si la fecha está en el último mes y hasta la fecha actual, devolver 'tomate'
  if (fechaObservacion >= primerDiaMesActual && fechaObservacion <= hoy) {
    return 'tomate';
  }
  // Si la fecha es anterior al último mes, devolver 'rojo'
  if (fechaObservacion < primerDiaMesActual) {
    return 'rojo';
  }
  // En cualquier otro caso, devolver ''
  return '';
}

export function convertirStringAFecha(fechaString: string): Date {
  const [dia, mes, anio] = fechaString.split('-').map(Number);
  return new Date(anio, mes-1 , dia);
}

const imageUrl = environment.imagesUrl;

export function getUrlImage(sku: string): string {
  if (!sku) return `${imageUrl}/default`;
  return `${imageUrl}/${sku}`;
}
