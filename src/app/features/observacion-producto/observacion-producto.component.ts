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
import {tieneCorreccion} from '@utils/observaciones-utils';
import {FiltroColorPipe} from '@shared/pipes/filtro-color.pipe';
import {TooltipModule} from 'primeng/tooltip';
import {InputTextModule} from 'primeng/inputtext';

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

  observaciones: ProductoObservacion[] = [];
  producto: any;
  observacion: ProductoObservacion = {} as ProductoObservacion;
  observacionSeleccionada!: ProductoObservacion
  request!: CorreccionRequest
  detalleOb!: string;
  diferencia: string = '';
  correccion!: ProductoCorreccion;
  barraItem!: string;
  vistaAddObservacion = false;
  vistaCorreccion = false;
  colorSeleccionado!: string;
  totalObservaciones!: number;
  novedad!: string;
  bodNombre: string='';

  bodegasessionStorage = sessionStorage.getItem('bodId') ?? '';
  usuariosessionStorage = sessionStorage.getItem('username') ?? '';

  imageUrl: string='';

  ngOnInit() {
    this.listarObservaciones()
  }

  logout() {

  }

  descargarExcel(){}


  seleccionarColor(){}

  selecionarObservacion(event:any){}

  mostrarProducto(){

  }

  guardarObservacion(){

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

  agregarCorreccion(){

  }

  listarObservaciones(){
    this.observacionService.listObservaciones(2).subscribe({
      next: data => {
        console.log(data);
        this.observaciones = data;
      }
    })
  }

  private convertirStringAFecha(fechaString: string): Date {
    const [dia, mes, anio] = fechaString.split('-').map(Number);
    return new Date(anio, mes - 1, dia);
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
}
