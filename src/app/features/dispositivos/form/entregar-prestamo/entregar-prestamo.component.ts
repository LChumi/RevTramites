import {Component, EventEmitter, inject, Input, OnInit, Output, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {PrestamoService} from '@services/dispositivos/perstamo.service';
import {DispositivoService} from '@services/dispositivos/dispositivo.service';
import {MessageService} from 'primeng/api';
import { Dispositivo } from "@models/dispositivos/dispositivo";
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {CalendarModule} from 'primeng/calendar';
import {InputTextareaModule} from 'primeng/inputtextarea';

@Component({
  selector: 'app-entregar-prestamo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    CalendarModule,
    InputTextareaModule
  ],
  templateUrl: './entregar-prestamo.component.html',
  styles: ``
})
export class EntregarPrestamoComponent implements OnInit {

  // Si viene preseleccionado desde dispositivos/lista
  @Input() dispositivoIdPreseleccionado: string | null = null;
  @Output() guardado = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly prestamoService = inject(PrestamoService);
  private readonly dispositivoService = inject(DispositivoService);
  private readonly messageService = inject(MessageService);

  disponibles = signal<Dispositivo[]>([]);
  loadingDisponibles = signal(true);
  saving = signal(false);

  form = this.fb.group({
    dispositivoId: [null as string | null, Validators.required],
    responsable: ['', Validators.required],
    fechaEntrega: [new Date(), Validators.required],
    fechaEsperadaDevolucion: [null as Date | null],
    observaciones: [''],
  });

  ngOnInit(): void {
    this.dispositivoService.disponibles().subscribe({
      next: (data) => {
        this.disponibles.set(data);
        this.loadingDisponibles.set(false);

        if (this.dispositivoIdPreseleccionado) {
          this.form.patchValue({ dispositivoId: this.dispositivoIdPreseleccionado });
          this.form.get('dispositivoId')?.disable();
        }
      },
      error: () => {
        this.loadingDisponibles.set(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los equipos disponibles' });
      },
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const raw = this.form.getRawValue();

    const payload = {
      dispositivoId: raw.dispositivoId,
      responsable: raw.responsable,
      fechaEntrega: raw.fechaEntrega,
      fechaEsperadaDevolucion: raw.fechaEsperadaDevolucion,
      observaciones: raw.observaciones,
    };

    this.prestamoService.entregar(payload as any).subscribe({
      next: () => {
        this.saving.set(false);
        this.messageService.add({ severity: 'success', summary: 'Entregado', detail: 'Préstamo registrado correctamente' });
        setTimeout(() => this.guardado.emit(), 400);
      },
      error: (err) => {
        this.saving.set(false);
        const detail = err?.error?.message ?? 'No se pudo registrar el préstamo';
        this.messageService.add({ severity: 'error', summary: 'Error', detail });
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
