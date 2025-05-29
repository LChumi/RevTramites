import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'estadoColor',
  standalone: true
})
export class EstadoColorPipe implements PipeTransform {

  private estados: { [key: string]: any } = {
    'completo': {'background-color': 'green', 'color': 'white'},
    'sin_registro': {'background-color': 'tomato', 'color': 'white'},
    'no_llego': {'background-color': 'yellow', 'color': 'black'},
    'sobrante': {'background-color': 'purple', 'color': 'white'},
    'faltante': {'background-color': 'orange', 'color': 'white'},
    'agregado': {'background-color': 'yellow', 'color': 'black'},
    'retirado': {'background-color': 'red', 'color': 'white'},
    'registrado': { 'background-color': '#ADD8E6', 'color': 'black' },     // celeste suave
    'proceso':  { 'background-color': '#1E90FF', 'color': 'white' },     // azul tipo "dodger blue", menos oscuro
    'descargado':   { 'background-color': '#228B22', 'color': 'white' },     // verde tipo "forest green"
    'muestra':    { 'background-color': '#7CFC00', 'color': 'black' },     // "lawn green", más legible
    'finalizado': { 'background-color': '#FFD700', 'color': 'black' }      // dorado (queda muy bien)

  };

  transform(value: any): any {
    if (typeof value !== 'string') {
      value = String(value); // Convierte números en string
    }
    const baseStyle = {'border-radius': '15px', 'padding': '10px'};
    const estado = this.estados[value.toLowerCase()] || this.estados['no llego'];
    return {...baseStyle, ...estado};
  }

}
