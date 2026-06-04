import {Component, inject, OnInit} from '@angular/core';
import {TramiteEmbarque} from '@models/embarque/tramite-embarque';
import {TableModule} from 'primeng/table';
import {DatePipe} from '@angular/common';
import {TramiteEmbarqueService} from '@services/embarque/tramite-embarque.service';
import {Tag, TagModule} from 'primeng/tag';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {TooltipModule} from 'primeng/tooltip';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ESTADOS_EMBARQUE_MOCK} from '@mocks/embarque';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';
import {InputTextModule} from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';
import {DialogModule} from 'primeng/dialog';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-lista-tramites',
  standalone: true,
  imports: [
    TableModule,
    DatePipe,
    TagModule,
    ButtonDirective,
    Ripple,
    TooltipModule,
    DropdownModule,
    CalendarModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    DialogModule
  ],
  templateUrl: './lista-tramites.component.html',
  styles: ``
})
export default class ListaTramitesComponent implements OnInit{

  private embarquesService = inject(TramiteEmbarqueService);
  private messageService = inject(MessageService)
  private fb = inject(FormBuilder)

  tramites: TramiteEmbarque[] = [];
  tramiteSeleccionado: TramiteEmbarque | null = null;
  dialogVisible = false;
  guardando = false;
  tramiteForm!: FormGroup;
  estadoOpciones = ESTADOS_EMBARQUE_MOCK

  ngOnInit(): void {
    this.embarquesService.list().subscribe({
      next: result => {
        this.tramites = result;
        this.initForm();
      }
    })
  }

  private initForm() {
    this.tramiteForm = this.fb.group({
      ordenLlegada:          ['', Validators.required],
      empresaId:             ['', Validators.required],
      numeroTramite:         ['', Validators.required],
      proveedorId:           ['', Validators.required],
      numeroBl:              [''],
      cantidadContenedores:  [null],
      fleteValidadoId:       [''],
      fechaEmbarque:         [null],
      fechaArribo:           [null],
      diasLibres:            [0],
      puertoSalida:          [''],
      puertoLlegada:         [''],
      solicitudNEcuapass:    [''],
      fechaSolicitudEcuapass:[null],
      identificar:           [''],
      solicitudNIntertek:    [''],
      preLiquidacion:        [''],
      polizaNChub:           [''],
      estado:                ['ACTIVO', Validators.required],
    });
  }

  editarTramite(tramite: TramiteEmbarque) {
    this.tramiteSeleccionado = tramite;
    // patchValue convierte strings de fecha a objetos Date para p-calendar
    this.tramiteForm.patchValue({
      ...tramite,
      fechaEmbarque:          tramite.fechaEmbarque ? new Date(tramite.fechaEmbarque) : null,
      fechaArribo:            tramite.fechaArribo   ? new Date(tramite.fechaArribo)   : null,
      fechaSolicitudEcuapass: tramite.fechaSolicitudEcuapass ? new Date(tramite.fechaSolicitudEcuapass) : null,
    });
    this.dialogVisible = true;
  }

  cerrarDialog() {
    this.dialogVisible = false;
    this.tramiteSeleccionado = null;
    this.tramiteForm.reset();
  }

  guardarTramite() {
    if (this.tramiteForm.invalid) {
      this.tramiteForm.markAllAsTouched();
      return;
    }
    this.guardando = true;
    const payload: TramiteEmbarque = {
      ...this.tramiteSeleccionado!,
      ...this.tramiteForm.value,
    };
    if (this.tramiteSeleccionado){
      this.embarquesService.update(this.tramiteSeleccionado.id, payload).subscribe({
        next: value => {
          console.log(value)
          this.messageService.add({severity: 'info', detail: 'Cambios actualizados'})
          this.onTramiteActualizado(value)
        },
        error: err => {
          this.messageService.add({severity: 'error', detail: 'Error en el servicio'})
          this.guardando = false;
        }
      })
      this.guardando = false;
      this.cerrarDialog();
    }

  }

  onTramiteActualizado(tramite: TramiteEmbarque){
    const index = this.tramites.findIndex(t => t.id === tramite.id);
    if (index !== -1){
      this.tramites[index] = tramite
    }
  }

  getEstadoSeverity(estado: string): Tag['severity'] {
    const map: Record<string, Tag['severity']> = {
      BORRADOR: 'info',
      EN_PROCESO: 'warning',
      EMBARCADO: 'success',
      ARRIBADO: 'secondary',
      FINALIZADO: 'success',
      CANCELADO: 'danger'
    };

    return map[estado?.toUpperCase()] ?? 'info';
  }

}
