import {Component, inject, OnInit} from '@angular/core';
import {ProductoObservacionService} from '@services/producto-observacion.service';
import {ProductoObservacion} from '@models/producto-observacion';
import {Button} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {FormsModule} from '@angular/forms';
import {DividerModule} from 'primeng/divider';
import {CardModule} from 'primeng/card';
import {ChipModule} from 'primeng/chip';
import {TagModule} from 'primeng/tag';
import {AvatarModule} from 'primeng/avatar';
import {TableModule} from 'primeng/table';
import {NgClass} from '@angular/common';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ProductoCorreccion} from '@dtos/producto-correccion';
import {CorreccionRequest} from '@dtos/correccion-request';
import {getUrlImage, tieneCorreccion} from '@utils/observaciones-utils';
import {FiltroColorPipe} from '@shared/pipes/filtro-color.pipe';
import {TooltipModule} from 'primeng/tooltip';
import {InputTextModule} from 'primeng/inputtext';
import {ProductoSis} from '@dtos/producto-sis';
import {ProductoSisService} from '@services/producto-sis.service';
import {MessageService} from 'primeng/api';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-observacion-producto',
  standalone: true,
  imports: [
    Button,
    DialogModule,
    FormsModule,
    DividerModule,
    CardModule,
    ChipModule,
    TagModule,
    AvatarModule,
    TableModule,
    NgClass,
    InputTextareaModule,
    FiltroColorPipe,
    TooltipModule,
    InputTextModule
  ],
  templateUrl: './observacion-producto.component.html',
  styleUrl: './observacion-producto.component.scss'
})
export default class ObservacionProductoComponent implements OnInit {

  private observacionService = inject(ProductoObservacionService);
  private productoService = inject(ProductoSisService);
  private messageService = inject(MessageService);

  observaciones: ProductoObservacion[] = [];
  producto: ProductoSis | null = null;
  observacion: ProductoObservacion = {} as ProductoObservacion;
  observacionSeleccionada!: ProductoObservacion
  request!: CorreccionRequest
  detalleOb!: string;
  diferencia: string = '';
  correccion!: ProductoCorreccion;
  barraItem!: string;
  vistaAddObservacion = false;
  imagenAmpliada = false;
  vistaCorreccion = false;
  colorSeleccionado!: string;
  totalObservaciones!: number;
  novedad!: string;
  bodNombre= sessionStorage.getItem('bodega') ?? '';

  bodId = sessionStorage.getItem('bodId') ?? '';
  usuariosessionStorage = sessionStorage.getItem('username') ?? '';

  imageUrl: string = '';

  ngOnInit() {
    if (this.bodId == '' || this.usuariosessionStorage == ''){
      this.messageService.add({severity: 'warn', summary: 'Usuario sin bodega', detail: 'Usuario si bodega ni sesión'})
      return;
    }
    this.listarObservaciones()
  }

  seleccionarColor() {
  }

  selecionarObservacion(obs: ProductoObservacion) {
    this.observacionSeleccionada = obs;
    console.log(this.observacionSeleccionada)
  }

  mostrarProducto() {
    if (!this.barraItem) {
      this.messageService.add({severity: 'warn', summary:'Ingrese Barra o Item'})
      return;
    }

    this.barraItem = this.barraItem.toLocaleUpperCase();

    this.productoService.getProducto(this.bodId, this.barraItem).subscribe({
      next: producto => {
        this.producto = producto;
      },
      error: error => {
        this.messageService.add({severity: 'error', summary: 'Producto no encontrado'})
        this.barraItem = '';
        this.producto = null
      }
    })

  }

  guardarObservacion() {

  }

  abrirVentana() {

    this.vistaAddObservacion = true;
  }

  cerrarVentana() {
    this.vistaAddObservacion = false;
  }

  abrirVentanaCorreccion() {
    this.vistaCorreccion = true;
  }

  cerrarVentanaCorreccion() {
    this.vistaCorreccion = false;
  }

  agregarCorreccion() {

  }

  listarObservaciones() {
    this.observacionService.listObservaciones(this.bodId).subscribe({
      next: data => {
        this.observaciones = data;
      }
    })
  }

  isRecent(fecha: string): boolean {
    const d = new Date(fecha);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / 86400000;
    return diff <= 30;
  }

  get totalCorregidas() {
    return this.observaciones.filter(o => o.correccion).length;
  }

  get totalPendientes() {
    return this.observaciones.filter(o => !o.correccion && this.isRecent(o.fecha)).length;
  }

  get totalAntiguas() {
    return this.observaciones.filter(o => !o.correccion && !this.isRecent(o.fecha)).length;
  }

  protected readonly tieneCorreccion = tieneCorreccion;
  protected readonly getUrlImage = getUrlImage;
}
