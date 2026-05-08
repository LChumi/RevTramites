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
  observacionSeleccionada!: ProductoObservacion
  request!: CorreccionRequest
  detalleOb!: string;
  diferencia: string = '';
  barraItem!: string;
  vistaAddObservacion = false;
  imagenAmpliada = false;
  vistaCorreccion = false;
  colorSeleccionado!: string;
  novedad!: string;
  bodNombre = sessionStorage.getItem('bodega') ?? '';

  bodId = sessionStorage.getItem('bodId') ?? '';
  usuariosessionStorage = sessionStorage.getItem('username') ?? '';

  imageUrl: string = '';

  ngOnInit() {
    if (this.bodId == '' || this.usuariosessionStorage == '') {
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
      this.messageService.add({severity: 'warn', summary: 'Ingrese Barra o Item'})
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
    if (!this.detalleOb) {
      this.messageService.add({severity: 'warn', summary: 'Ingrese Barra o Item'})
      return;
    }

    if (this.producto) {
      const observacion: ProductoObservacion = {
        idBodega: this.bodId,
        fecha: null,
        item: this.producto.proId1,
        descripcion: this.producto.nombre,
        bulto: this.producto.bulto,
        cxb: this.producto.cxb,
        stock: this.producto.stockReal,
        precio: this.producto.pvp,
        detalle: this.detalleOb.toUpperCase(),
        diferencia: this.diferencia ? this.diferencia.toUpperCase() : null,
        usuario: this.usuariosessionStorage
      }

      this.observacionService.saveProduct(observacion).subscribe({
        next: producto => {
          this.listarObservaciones();
          this.detalleOb = '';
          this.diferencia = '';
          this.cerrarVentana();
          this.messageService.add({severity: 'success', summary: 'Observacion guardada'})
        }, error: error => {
          this.detalleOb = '';
          this.diferencia = '';
          this.messageService.add({severity: 'error', summary: 'Ingreso no valido'})
        }
      })
    }

  }

  abrirVentana() {
    this.vistaAddObservacion = true;
  }

  cerrarVentana() {
    this.vistaAddObservacion = false;
    this.producto = null;
    this.barraItem = ''
  }

  abrirVentanaCorreccion() {
    this.vistaCorreccion = true;
  }

  cerrarVentanaCorreccion() {
    this.vistaCorreccion = false;
    this.novedad = '';
  }

  agregarCorreccion() {
    if (!this.novedad) {
      this.messageService.add({severity: 'warn', summary: 'Ingrese la novedad'})
    }

    if (this.observacionSeleccionada) {
      const obs: ProductoCorreccion = {
        detalle: this.novedad,
        usuario: this.usuariosessionStorage
      }
      const request: CorreccionRequest = {
        idProducto: this.observacionSeleccionada.id,
        correccion: obs
      }

      this.observacionService.addCorrecion(request).subscribe({
        next: producto => {
          this.listarObservaciones();
          this.cerrarVentanaCorreccion();
          this.messageService.add({
            severity: 'success',
            summary: 'Correcion agregada',
            detail: `CORRECCION AGREGADA AL ITEM ${producto.item}`
          })
        }, error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Novedad no registrada',
            detail: 'Producto no encontrado'
          })
          this.novedad = ''
        }
      })
    }
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

  get totalObservaciones() {
    return this.observaciones.length;
  }

  protected readonly tieneCorreccion = tieneCorreccion;
  protected readonly getUrlImage = getUrlImage;
}
