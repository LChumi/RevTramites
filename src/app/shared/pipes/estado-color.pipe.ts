import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoColor',
  standalone: true
})
export class EstadoColorPipe implements PipeTransform {

  transform(value: string): any {
    switch (value.toLowerCase()) {
      case 'completo':
        return { 'background-color': 'green', 'color': 'white' };
      case 'sin registro':
        return { 'background-color': 'tomato', 'color': 'white' };
      case 'no llego':
        return { 'background-color': 'yellow', 'color': 'black' };
      case 'sobrante':
        return { 'background-color': 'purple', 'color': 'white' };
      case 'faltante':
        return { 'background-color': 'orange', 'color': 'white' };
      default:
        return { 'background-color': 'yellow', 'color': 'black' };
    }
  }

}
