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
        icon: 'pi pi-th-large',
        items: [
          {
            label: 'Carga Tramites',
            icon: 'pi pi-th-large',
            route: ['/'],
            items: [
              {
                label: 'Carga de Tramites por llegar',
                icon: 'pi pi-upload',
                routerLink: '/icep/bodega/tramite/carga-contenedores',
              },
              {
                label: 'Consultas',
                icon: 'pi pi-fw pi-search',
                routerLink: '/icep/bodega/tramite/consultas',
              }
            ]
          },
          {
            label: 'Revision',
            icon: 'pi pi-sliders-h',
            route: ['/'],
            items: [
              {
                label: 'Escaneo de Productos',
                icon: 'pi pi-barcode',
                routerLink: '/icep/bodega/revision/contenedor',
              },
              {
                label: 'Consultas',
                icon: 'pi pi-fw pi-search',
                routerLink: '/icep/bodega/revision/consultas',
              },
              {
                label: 'Validar',
                icon: 'pi pi-check',
                routerLink: '/icep/bodega/revision/validar',
              }
            ]
          },
          {
            label: 'Muestras',
            icon: 'pi pi-list',
            route: ['/'],
            items: [
              {
              label: 'Muestras por llegar',
              icon: 'pi pi-window-maximize',
              routerLink: '/icep/bodega/muestra/envio-muestras',
            },
              {
                label: 'Consultas',
                icon: 'pi pi-fw pi-search',
                routerLink: '/icep/bodega/muestra/consultas',
              }
              ]
          },
        ]
      },
    ]
  }

}
