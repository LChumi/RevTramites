import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoColor',
  standalone: true
})
export class EstadoColorPipe implements PipeTransform {

  private estados: { [key: string]: any } = {
    'completo': { 'background-color': 'green', 'color': 'white' },
    'sin registro': { 'background-color': 'tomato', 'color': 'white' },
    'no llego': { 'background-color': 'yellow', 'color': 'white' },
    'sobrante': { 'background-color': 'purple', 'color': 'white' },
    'faltante': { 'background-color': 'orange', 'color': 'white' },
  };

  transform(value: string): any {
    const baseStyle = { 'border-radius': '15px', 'padding': '10px' };
    const estado = this.estados[value.toLowerCase()] || this.estados['no llego'];
    return { ...baseStyle, ...estado };
  }

}
