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

export function getTime(hora: any): string | null {
  if (!hora) {
    return null;
  }
  const hours = hora.getHours().toString().padStart(2, '0');
  const minutes = hora.getMinutes().toString().padStart(2, '0');
  const seconds = '00'; // Si no manejas segundos, puedes dejarlo fijo.
  return `${hours}:${minutes}:${seconds}`; // Formato correcto para LocalTime en Spring.
}

export function horaEnMinutos(hours: string): number {
  const [h, m, s] = hours.split(':').map(Number);
  return h * 60 + m + s / 60;
}

export function horaEnDecimal(horaStr: string): number {
  const [h, m, s] = horaStr.split(':').map(Number);
  return h + m / 60 + s / 3600;
}

export function horaFormateada(horaStr: string): number {
  const [h, m, s] = horaStr.split(':').map(Number);
  return h + m / 100; // Divide por 100 para mantener el formato adecuado
}
