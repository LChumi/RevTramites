import {Component, OnInit} from '@angular/core';
import {MenuitemComponent} from '@shared/component/menuitem/menuitem.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MenuitemComponent
  ],
  templateUrl: './menu.component.html',
  styles: ``
})
export class MenuComponent implements OnInit{

  model: any[] =[]

  ngOnInit(): void {
    this.model = [
      {
        label: 'Tramites',
        icon: 'pi pi-fw pi-check-square',
        items: [
          {
            label: 'Carga de Tramites por llegar',
            icon: 'pi pi-upload',
            routerLink: '/icep/bodega-recepcion/carga-bultos',
          },
          {
            label: 'Consultas',
            icon: 'pi pi-fw pi-list',
            routerLink: '/icep/bodega-recepcion/consulta-tramite',
          }
        ]
      },
      {
        label: 'Revision tramites',
        icon: 'pi pi-fw pi-check-square',
        items: [
          {
            label: 'Revision de productos',
            icon: 'pi pi-barcode',
            routerLink: '/icep/bodega-recepcion/revision-bultos',
          },
          {
            label: 'Consultas',
            icon: 'pi pi-fw pi-list',
            routerLink: '/icep/bodega-recepcion/consulta-revision',
          }
        ]
      },
      {
        label: 'Muestras',
        icon: 'pi pi-fw pi-check-square',
        items: [
          {
            label: 'Muestras por llegar',
            icon: 'pi pi-window-maximize',
            routerLink: '/icep/bodega-recepcion/muestras',
          },
          {
            label: 'Consultas',
            icon: 'pi pi-fw pi-list',
            routerLink: '/icep/bodega-recepcion/consulta-muestras',
          }
        ]
      }
    ]
  }

}
