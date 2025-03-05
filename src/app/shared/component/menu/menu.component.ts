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
            label: 'Revision',
            icon: 'pi pi-th-large',
            route: ['/'],
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
            icon: 'pi pi-th-large',
            route: ['/'],
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
          },
        ]
      },
    ]
  }

}
