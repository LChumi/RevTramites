import {Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, signal, SimpleChanges} from '@angular/core';
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
export class EntregarPrestamoComponent implements OnInit, OnChanges{

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
    observaciones: [''],
  });

  ngOnInit(): void {
    this.dispositivoService.disponibles().subscribe({
      next: (data) => {
        this.disponibles.set(data);
        this.loadingDisponibles.set(false);
        this.aplicarPreseleccion();
      },
      error: () => {
        this.loadingDisponibles.set(false);
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dispositivoIdPreseleccionado'] && !changes['dispositivoIdPreseleccionado'].firstChange) {
      this.aplicarPreseleccion();
    }
  }

  private aplicarPreseleccion(): void {
    if (this.dispositivoIdPreseleccionado) {
      this.form.patchValue({ dispositivoId: this.dispositivoIdPreseleccionado });
      this.form.get('dispositivoId')?.disable();
    } else {
      this.form.get('dispositivoId')?.enable();
    }
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
      responsable: raw.responsable?.toUpperCase(),
      fechaEntrega: raw.fechaEntrega,
      observaciones: raw.observaciones?.toUpperCase(),
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
