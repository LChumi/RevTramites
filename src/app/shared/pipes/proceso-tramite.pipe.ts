import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'procesoTramite',
  standalone: true
})
export class ProcesoTramitePipe implements PipeTransform {

  transform(value: number): string {
    switch (value) {
      case 1:
        return 'Registrado';
      case 2:
        return 'Proceso';
      case 3:
        return 'Descargado';
      case 4:
        return 'Muestra';
      case 5:
        return 'Finalizado';
      default:
        return 'Sin Proceso';
    }
  }

}
