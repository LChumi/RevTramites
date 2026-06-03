import {Component, inject, input, OnInit, output, signal} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {SalidaBuqueService} from '@services/embarque/salida-buque.service';
import {PuertoEmbarque} from '@models/embarque/puerto-embarque';
import {Consignatario} from '@models/embarque/consignatario';
import {SalidaBuque} from '@models/embarque/salida-buque';
import {CotizacionConsignatario} from '@models/embarque/cotizacion-consignatario';
import {MessageModule} from 'primeng/message';
import {Button} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';
import {CardModule} from 'primeng/card';
import {BadgeModule} from 'primeng/badge';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';

@Component({
  selector: 'app-salida-buque-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MessageModule,
    Button,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    CardModule,
    BadgeModule,
    DropdownModule,
    CalendarModule
  ],
  templateUrl: './salida-buque-form.component.html',
  styles: ``
})
export class SalidaBuqueFormComponent implements OnInit{

  private fb        = inject(FormBuilder);
  private service   = inject(SalidaBuqueService);

  procesoCotizacionId = input.required<string>();
  puertos             = input<PuertoEmbarque[]>([]);
  consignatarios      = input<Consignatario[]>([]);

  guardado  = output<SalidaBuque>();
  cerrar    = output<void>();

  abierto   = signal(false);
  guardando = signal(false);
  error     = signal<string | null>(null);

  form!: FormGroup;

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.fb.group({
      puertoEmbarqueId:     ['', Validators.required],
      puertoEmbarqueNombre: [''],           // se rellena automáticamente
      fechaDesde:           ['', Validators.required],
      fechaHasta:           ['', Validators.required],
      diasLibres:           [0, [Validators.required, Validators.min(0)]],
      activo:               [true],
      cotizaciones:         this.fb.array([this.buildCotizacion()]),
    });
  }

  buildCotizacion(): FormGroup {
    return this.fb.group({
      consignatarioId:     ['', Validators.required],
      nombreConsignatario: [''],
      opciones:            this.fb.array([]),
    });
  }

  get cotizaciones(): FormArray {
    return this.form.get('cotizaciones') as FormArray;
  }

  cotizacionAt(i: number): FormGroup {
    return this.cotizaciones.at(i) as FormGroup;
  }

  onPuertoChange(id: string): void {
    const puerto = this.puertos().find(p => p.id === id);
    this.form.patchValue({ puertoEmbarqueNombre: puerto?.nombre ?? '' });
  }

  onConsignatarioChange(index: number, id: string): void {
    const c = this.consignatarios().find(c => c.id === id);
    this.cotizacionAt(index).patchValue({ nombreConsignatario: c?.nombre ?? '' });
  }

  eliminarCotizacion(index: number): void {
    if (this.cotizaciones.length > 1) {
      this.cotizaciones.removeAt(index);
    }
  }

  abrir(): void {
    this.buildForm();
    this.error.set(null);
    this.abierto.set(true);
  }

  cerrarDialog(): void {
    this.abierto.set(false);
    this.cerrar.emit();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    const raw = this.form.getRawValue();

    const payload: SalidaBuque = {
      procesoCotizacionId:  this.procesoCotizacionId(),
      puertoEmbarqueNombre: raw.puertoEmbarqueNombre,
      fechaDesde:           new Date(raw.fechaDesde),
      fechaHasta:           new Date(raw.fechaHasta),
      diasLibres:           raw.diasLibres,
      activo:               raw.activo,
      cotizaciones:         raw.cotizaciones as CotizacionConsignatario[],
      creadoEn:             new Date(),
      actualizadoEn:        new Date(),
      id:                   null,
    };

    this.service.save(payload).subscribe({
      next: (buque) => {
        this.guardando.set(false);
        this.guardado.emit(buque);
        this.cerrarDialog();
      },
      error: (err) => {
        this.guardando.set(false);
        this.error.set('Error al guardar. Intenta de nuevo.');
        console.error(err);
      },
    });
  }

  isInvalid(path: string): boolean {
    const ctrl = this.form.get(path);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  isInvalidInCotizacion(i: number, field: string): boolean {
    const ctrl = this.cotizacionAt(i).get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

}
