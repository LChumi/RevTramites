import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'estadoColor',
  standalone: true
})
export class EstadoColorPipe implements PipeTransform {

  private estados: { [key: string]: any } = {
    'completo': {'background-color': '#9ceb9b', 'color': 'white'},
    'incompleto': {'background-color': '#d4c294', 'color': 'white'},
    'sin_registro': {'background-color': '#ebc99b', 'color': 'white'},
    'no_llego': {'background-color': '#e8e49e', 'color': 'black'},
    'sobrante': {'background-color': '#c294d4', 'color': 'white'},
    'faltante': {'background-color': '#d4c294', 'color': 'white'},
    'agregado': {'background-color': '#c0c248', 'color': 'black'},
    'retirado': {'background-color': '#d49894', 'color': 'white'},
    'registrado': {'background-color': '#ADD8E6', 'color': 'black'},
    'proceso': {'background-color': '#1E90FF', 'color': 'white'},
    'descargado': {'background-color': '#228B22', 'color': 'white'},
    'muestra': {'background-color': '#7CFC00', 'color': 'black'},
    'finalizado': {'background-color': '#FFD700', 'color': 'black'}

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
