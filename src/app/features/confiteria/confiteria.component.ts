import {Component, inject} from '@angular/core';
import {ProductoSisService} from '@services/producto-sis.service';
import {ConfiteriaService} from '@services/confiteria.service';
import {proveedor, PROVEEDORES_MOCK} from '../../core/mocks/proveedores';
import {ConfiteriaRepor} from '@dtos/confiteria-repor';
import {ReposicionConfiteria} from '@dtos/reposicion-confiteria';
import {ReposicionRequest} from '@dtos/reposicion-request';
import {DialogModule} from 'primeng/dialog';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {DatePipe, PercentPipe} from '@angular/common';
import {TableModule} from 'primeng/table';
import {CardModule} from 'primeng/card';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';

@Component({
  selector: 'app-confiteria',
  standalone: true,
  imports: [
    DialogModule,
    FormsModule,
    Button,
    ProgressSpinnerModule,
    PercentPipe,
    DatePipe,
    TableModule,
    CardModule,
    DropdownModule,
    InputTextModule
  ],
  templateUrl: './confiteria.component.html',
  styleUrl: './confiteria.component.scss'
})
export default class ConfiteriaComponent {

  private productoService= inject(ProductoSisService)
  private confiteriaService = inject(ConfiteriaService);

  proveedores: proveedor[] = PROVEEDORES_MOCK

  proveedor!: string
  listaProductos: ConfiteriaRepor[] = [];
  productoSelect: ConfiteriaRepor | null = null;
  loadingProducto = false;
  saveAndGetExel = false;
  buttonBlock = false;
  showModal = false;
  cantidadPed!: number;

  obtenerProductos() {
    if (!this.proveedor) {
      alert("Ingrese un proveedor");
      return;
    }
    this.buttonBlock = true;
    this.loadingProducto = true;

    const proveedorCodificado = encodeURIComponent(this.proveedor);

    this.productoService.listaConfiteria(proveedorCodificado).subscribe({
      next: result => {
        if (result) {
          this.listaProductos = result
          this.ordenarPorRotacionDesc()
          this.loadingProducto = false;
        } else {
          this.loadingProducto = false;
          this.buttonBlock = false;
        }
      }
    })
  }

  calcularRotacion(producto: any): number {
    const ventas = producto.cantVenta || 0;
    const stockIni = producto.stockIni || 0;
    const totalCompra = producto.ultCantCom || 0;

    const denominador = stockIni + totalCompra;
    if (denominador === 0) {
      return 0;
    }
    return ventas / denominador;
  }

  agregarCantidad(producto: any) {
    this.productoSelect = producto;
    this.cantidadPed = producto.pedido || 0;
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
  }

  guardarCantidad() {
    if (this.productoSelect) {
      this.productoSelect.pedido = this.cantidadPed;
    }
    this.cerrarModal();
  }

  ordenarPorRotacionDesc() {
    this.listaProductos.sort((a, b) => {
      const rotA = this.calcularRotacion(a);
      const rotB = this.calcularRotacion(b);
      return rotB - rotA; // mayor a menor
    });
  }

  guardarProductos() {

    this.saveAndGetExel = true;

    const pedidosValidos = this.listaProductos.filter(
      producto =>
        producto.pedido !== null &&
        producto.pedido !== undefined &&
        producto.pedido > 0
    )

    if (pedidosValidos.length === 0) {
      alert("No hay pedidos, todos están en 0");
      return;
    }

    const proveedor = pedidosValidos[0].cliNombre
    const user = sessionStorage.getItem("username");

    if (user) {
      const repo: ReposicionConfiteria = {
        id: null,
        proveedor,
        estado: false,
        usuarioSolicitante: user,
        fecha: null
      }

      const request: ReposicionRequest = {
        repo,
        detalles: pedidosValidos
      }
      this.confiteriaService.guardarPedido(request).subscribe({
        next: result => {
          if (result) {
            const reposicionId = result[0].reposicionId;
            this.descargar(reposicionId)
            this.saveAndGetExel = false;
          }
        }
      })

    } else {
      alert('Por favor inicie sesion nuevamente')
    }
  }

  descargar(reposicionId: string) {
    this.confiteriaService.descargarExcel(reposicionId, this.proveedor).subscribe({
      error: (err) => console.error('Error al descargar:', err)
    });
  }
}
