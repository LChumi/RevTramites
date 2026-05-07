import { Pipe, PipeTransform } from '@angular/core';
import {ProductoObservacion} from '@models/producto-observacion';
import {tieneCorreccion} from '@utils/observaciones-utils';

@Pipe({
  name: 'filtroColor',
  standalone: true
})
export class FiltroColorPipe implements PipeTransform {

  transform(observaciones:ProductoObservacion[],color:string): ProductoObservacion[] {
    if (!color || color==='todos'){
      return observaciones;
    }

    return observaciones.filter(observacion => {
      const colorObservacion = tieneCorreccion(observacion);
      return colorObservacion === color;
    });
  }
}
