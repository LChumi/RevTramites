import {Component, inject, OnInit} from '@angular/core';
import {TramiteService} from '@services/tramite.service';
import {RevisionService} from '@services/revision.service';
import {Tramite} from '@models/tramite';
import {Producto} from '@models/producto';
import {forkJoin} from 'rxjs';
import {DataView, DataViewModule} from 'primeng/dataview';
import {DropdownModule} from 'primeng/dropdown';
import {MessageService} from 'primeng/api';
import {InputTextModule} from 'primeng/inputtext';
import {ProcesoTramitePipe} from '@shared/pipes/proceso-tramite.pipe';
import {NgStyle} from '@angular/common';
import {EstadoColorPipe} from '@shared/pipes/estado-color.pipe';

export interface SelectItem<T = any> {
  label?: string;
  value: T;
  styleClass?: string;
  icon?: string;
  title?: string;
  disabled?: boolean;
}

@Component({
  standalone: true,
  templateUrl: './validacion-tramite.component.html',
  imports: [
    DataViewModule,
    DropdownModule,
    InputTextModule,
    ProcesoTramitePipe,
    NgStyle,
    EstadoColorPipe
  ],
  styles: ``
})
export default class ValidacionTramiteComponent implements OnInit {

  private tramiteService = inject(TramiteService)
  private revisionService = inject(RevisionService)
  private messageService = inject(MessageService)

  user: any;
  tramiteId: string = '';
  barra: string = '';
  revisiones: Producto[] = [];
  sortOrder: number = 0;
  sortField: string = '';
  tramites: Tramite[] = [];
  tramite: Tramite | null = null;
  loading: boolean = false;

  ngOnInit(): void {
    this.listarCompletos([3, 2]);
    this.user = sessionStorage.getItem("username")
  }

  listarCompletos(processes: number[]): void {
    // Crear un array de observables con las solicitudes para cada proceso
    const observables = processes.map(process =>
      this.tramiteService.listByStatus(process)
    );

    // Combinar los resultados con forkJoin
    forkJoin(observables).subscribe({
      next: (results) => {
        // Combinar los resultados en una sola lista
        this.tramites = results.flat(); // Usamos flat() para aplanar los arrays
      },
      error: (err) => {
        this.messageService.add({
          severity: 'warn',
          summary: 'No existen Tramites',
          detail: 'No se encontraron Tramites Finalizados o Completos, finalize la revisión'
        });
      }
    });
  }

  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  }

}
