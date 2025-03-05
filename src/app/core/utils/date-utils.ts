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

export function getCurrentDateNow(): string {
  const fecha = new Date();
  const year = fecha.getFullYear();
  const month = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Mes con 2 dígitos
  const day = fecha.getDate().toString().padStart(2, '0'); // Día con 2 dígitos
  return `${year}-${month}-${day}`;
}

export function getCurrentTime(): string {
  const fecha = new Date();
  const hours = fecha.getHours();
  const minutes = fecha.getMinutes().toString().padStart(2, '0'); // Minutos con 2 dígitos
  const ampm = hours >= 12 ? 'pm' : 'am';
  const formattedHours = (hours % 12 || 12).toString().padStart(2, '0'); // Convierte 0 a 12
  return `${formattedHours}:${minutes} ${ampm}`;
}
