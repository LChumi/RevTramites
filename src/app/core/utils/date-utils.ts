// Devuelve la fecha actual en formato YYYY-MM-DD
export function getCurrentDate(fecha: any): any {
  if (!fecha) {
    return null;
  }
  const year = fecha.getFullYear();
  const month = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Mes con 2 dígitos
  const day = fecha.getDate().toString().padStart(2, '0'); // Día con 2 dígitos
  return `${year}-${month}-${day}`;
}
