import {Component, inject} from '@angular/core';
import {ChartModule} from 'primeng/chart';
import {MenuModule} from 'primeng/menu';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {ToolbarModule} from 'primeng/toolbar';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {ProcesoCotizacion} from '@models/embarque/proceso-cotizacion';
import {ProcesoCotizacionService} from '@services/embarque/proceso-cotizacion.service';
import {MessageService} from 'primeng/api';
import {DatePipe} from '@angular/common';
import {DialogModule} from 'primeng/dialog';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {TagModule} from 'primeng/tag';
import {CardModule} from 'primeng/card';
import {EMPRESA_MOCK, REFERENCIAS_MOCK} from '@mocks/embarque';

@Component({
  selector: 'app-proceso-list',
  standalone: true,
  imports: [
    ChartModule,
    MenuModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    ButtonDirective,
    Ripple,
    DatePipe,
    DialogModule,
    FormsModule,
    InputTextModule,
    DropdownModule,
    TagModule,
    CardModule
  ],
  templateUrl: './proceso-list.component.html',
  styles: ``
})
export default class ProcesoListComponent {

  private procesoService = inject(ProcesoCotizacionService)
  private messageService = inject(MessageService)

  cotizacionDialog: boolean = false

  cotizaciones: ProcesoCotizacion[] = []
  cotizacion: ProcesoCotizacion = {} as ProcesoCotizacion

  tiposReferencia = REFERENCIAS_MOCK
  empresas = EMPRESA_MOCK

  nuevoProceso(){
    this.cotizacionDialog = true
  }

  viewCotizacion(id: string){

  }

  saveCotizacion(){

  }

  getEstadoSeverity(estado: string) {
    switch (estado) {
      case 'BORRADOR':
        return 'secondary';

      case 'EN_VALIDACION':
        return 'warning';

      case 'FINALIZADO':
        return 'success';

      default:
        return 'contrast';
    }
  }

  getEmpresaNombre(code: number): string {
    const empresa = EMPRESA_MOCK.find(e => e.code === code);
    return empresa ? empresa.name : 'Desconocida';
  }

}
