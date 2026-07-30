// src/app/features/prestamos/devolver/devolver-prestamo.component.ts

import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {Prestamo} from '@models/dispositivos/prestamo';
import {PrestamoService} from '@services/dispositivos/perstamo.service';
import {EstadoDispositivo, ESTADOS_DISPOSITIVO} from '@models/dispositivos/estado-dispositivo';

// Solo tiene sentido volver a estos estados al devolver
const ESTADOS_DEVOLUCION = ESTADOS_DISPOSITIVO.filter(e =>
  [EstadoDispositivo.DISPONIBLE, EstadoDispositivo.MANTENIMIENTO, EstadoDispositivo.DANADO, EstadoDispositivo.BAJA]
    .includes(e.value)
);

@Component({
  selector: 'app-devolver-prestamo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DropdownModule, InputTextareaModule, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './devolver-prestamo.component.html',
})
export class DevolverPrestamoComponent {

  @Input() prestamo: Prestamo | null = null;
  @Output() guardado = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly prestamoService = inject(PrestamoService);
  private readonly messageService = inject(MessageService);

  readonly estadosDevolucion = ESTADOS_DEVOLUCION;
  saving = signal(false);

  form = this.fb.group({
    estadoFinal: [EstadoDispositivo.DISPONIBLE, Validators.required],
    observaciones: [''],
  });

  guardar(): void {
    if (!this.prestamo) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const { estadoFinal, observaciones } = this.form.getRawValue();

    this.prestamoService.devolver(this.prestamo.id, estadoFinal!, observaciones || undefined).subscribe({
      next: () => {
        this.saving.set(false);
        this.messageService.add({ severity: 'success', summary: 'Devuelto', detail: 'Devolución registrada correctamente' });
        setTimeout(() => this.guardado.emit(), 400);
      },
      error: (err) => {
        this.saving.set(false);
        const detail = err?.error?.message ?? 'No se pudo registrar la devolución';
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
