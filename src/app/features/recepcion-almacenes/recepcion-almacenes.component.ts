import {Component, inject, OnInit} from '@angular/core';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {CheckboxModule} from 'primeng/checkbox';
import {NgClass} from '@angular/common';
import {AvatarGroupModule} from 'primeng/avatargroup';
import {AvatarModule} from 'primeng/avatar';
import {MenuModule} from 'primeng/menu';
import {DropdownModule} from 'primeng/dropdown';
import {BodegaService} from '@services/bodega.service';
import {Bodega} from '@dtos/bodega';
import {FormsModule} from '@angular/forms';
import {RecepcionAlmacenesService} from '@services/recepcion-almacenes.service';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {Comprobantes} from '@dtos/recepcion-almacenes/comprobantes';
import {RecepcionSidebarComponent} from '@features/recepcion-almacenes/recepcion-sidebar/recepcion-sidebar.component';

@Component({
  selector: 'app-recepcion-almacenes',
  standalone: true,
  imports: [
    CheckboxModule,
    AvatarGroupModule,
    AvatarModule,
    MenuModule,
    DropdownModule,
    FormsModule,
    ProgressSpinnerModule,
    CardModule,
    TableModule,
    RecepcionSidebarComponent
  ],
  templateUrl: './recepcion-almacenes.component.html',
  styles: ``
})
export default class RecepcionAlmacenesComponent {

}
