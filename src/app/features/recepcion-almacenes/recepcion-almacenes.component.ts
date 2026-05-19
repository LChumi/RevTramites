import {Component, inject, OnInit} from '@angular/core';
import {CheckboxModule} from 'primeng/checkbox';
import {AvatarGroupModule} from 'primeng/avatargroup';
import {AvatarModule} from 'primeng/avatar';
import {MenuModule} from 'primeng/menu';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';

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
    TableModule
  ],
  templateUrl: './recepcion-almacenes.component.html',
  styles: ``
})
export default class RecepcionAlmacenesComponent {

}
