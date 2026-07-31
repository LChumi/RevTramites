import {Component, computed, effect, inject, input, output, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {DispositivoService} from '@services/dispositivos/dispositivo.service';
import { ESTADOS_DISPOSITIVO } from "@models/dispositivos/estado-dispositivo";
import {MessageService} from 'primeng/api';
import {Dispositivo} from '@models/dispositivos/dispositivo';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';
import {CheckboxModule} from 'primeng/checkbox';

const CATEGORIAS = [
  'Laptop', 'Monitor', 'Teclado', 'Mouse', 'Diadema',
  'Proyector', 'Tablet', 'Celular', 'Lector-barra', 'Otro',
];

@Component({
  selector: 'app-dispositivo-form',
  standalone: true,
  imports: [
    CardModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule
  ],
  templateUrl: './dispositivo-form.component.html',
  styles: ``
})

export class DispositivoFormComponent {

  private readonly fb = inject(FormBuilder);
  private readonly dispositivoService = inject(DispositivoService);
  private readonly messageService = inject(MessageService);

  // Inputs / Outputs
  readonly dispositivoId = input<string | null>(null);

  readonly guardado = output<void>();
  readonly cancelado = output<void>();

  readonly estados = ESTADOS_DISPOSITIVO;
  readonly categorias = CATEGORIAS;

  readonly editMode = computed(() => this.dispositivoId() !== null);
  readonly saving = signal(false);

  readonly form = this.fb.group({
    serial: ['', [Validators.required, Validators.minLength(3)]],
    marca: ['', Validators.required],
    modelo: ['', Validators.required],
    categoria: [null as string | null, Validators.required],
    fechaCompra: [null as Date | null, Validators.required],
    estadoActual: ['DISPONIBLE', Validators.required],
    ubicacion: ['', Validators.required],
    activo: [true],
  });

  constructor() {
    effect(() => {
      const id = this.dispositivoId();

      if (id) {
        this.cargarDispositivo(id);
      } else {
        this.form.reset({
          serial: '',
          marca: '',
          modelo: '',
          categoria: null,
          fechaCompra: null,
          estadoActual: 'DISPONIBLE',
          ubicacion: '',
          activo: true,
        });
      }
    });
  }

  private cargarDispositivo(id: string): void {
    console.log('Cargando', id);
    this.dispositivoService.findById(id).subscribe({
      next: (d) => {
        this.form.patchValue({
          serial: d.serial,
          marca: d.marca,
          modelo: d.modelo,
          categoria: d.categoria,
          fechaCompra: d.fechaCompra ? new Date(d.fechaCompra) : null,
          estadoActual: d.estadoActual,
          ubicacion: d.ubicacion,
          activo: d.activo,
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el equipo',
        });
      },
    });
  }

  guardar(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    const raw = this.form.getRawValue() as Dispositivo;

    const payload: Dispositivo = {
      ...raw,
      serial: raw.serial?.toUpperCase(),
      marca: raw.marca?.toUpperCase(),
      modelo: raw.modelo?.toUpperCase(),
      ubicacion: raw.ubicacion?.toUpperCase(),
    };

    const request$ = this.editMode()
      ? this.dispositivoService.actualizar(this.dispositivoId()!, {
        ...payload,
        id: this.dispositivoId()!,
      })
      : this.dispositivoService.registrar(payload);

    request$.subscribe({
      next: () => {

        this.saving.set(false);

        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: this.editMode()
            ? 'Equipo actualizado'
            : 'Equipo registrado',
        });
        this.form.reset()
        this.guardado.emit();
      },
      error: () => {

        this.saving.set(false);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar el equipo',
        });
      },
    });

  }

  cancelar(): void {
    this.cancelado.emit();
  }

  get f() {
    return this.form.controls;
  }

}
