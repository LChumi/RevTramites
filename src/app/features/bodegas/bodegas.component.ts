import {Component, inject, OnInit} from '@angular/core';
import {DividerModule} from 'primeng/divider';
import {Button} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {PaginatorModule} from 'primeng/paginator';
import {CardModule} from 'primeng/card';
import {NgOptimizedImage} from '@angular/common';
import {BodegaService} from '@services/bodega.service';
import {Bodega} from '@dtos/bodega';

@Component({
  selector: 'app-bodegas',
  standalone: true,
  imports: [
    DividerModule,
    Button,
    DialogModule,
    PaginatorModule,
    CardModule,
    NgOptimizedImage
  ],
  templateUrl: './bodegas.component.html',
  styleUrl: './bodegas.component.scss'
})
export default class BodegasComponent implements OnInit {

  private bodegaService = inject(BodegaService)

  listaBodegas!: Bodega[];
  showModal: boolean = false;
  codigo: string ='';
  downloading=false;
  id_usuario: string= ''
  id_empresa: any

  constructor() {
    this.id_usuario = sessionStorage.getItem('usercode') ?? '';
    this.id_empresa = sessionStorage.getItem('idEmpresa') ?? '';
  }

  ngOnInit() {
    if (this.id_usuario == '' || this.id_empresa == '') {
      alert('Vuelva a iniciar sesión')
    }
    this.listarBodegas()
  }

  descargarExcel(){

  }

  descargarPdf(){

  }

  BodegaSelecccionada(bodega:any){

  }

  listarBodegas() {
    this.bodegaService.getBodegas(this.id_usuario, this.id_empresa).subscribe({
      next: (result) => {
        this.listaBodegas = result;
      }
    })
  }
}
