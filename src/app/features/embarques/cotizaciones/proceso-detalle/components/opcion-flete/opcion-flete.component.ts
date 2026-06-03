import {Component} from '@angular/core';
import {MessageModule} from 'primeng/message';
import {ButtonDirective} from 'primeng/button';
import {DatePipe} from '@angular/common';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {DividerModule} from 'primeng/divider';
import {BadgeModule} from 'primeng/badge';
import {TagModule} from 'primeng/tag';
import {Ripple} from 'primeng/ripple';
import {DialogModule} from 'primeng/dialog';
import {SidebarModule} from 'primeng/sidebar';

@Component({
  selector: 'app-opcion-flete',
  standalone: true,
  imports: [
    MessageModule,
    ProgressSpinnerModule,
    DividerModule,
    BadgeModule,
    TagModule,
    DialogModule,
    SidebarModule
  ],
  templateUrl: './opcion-flete.component.html',
  styles: ``
})
export class OpcionFleteComponent {


}
