import {Component, inject, OnInit} from '@angular/core';
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
import {ActivatedRoute, Router} from '@angular/router';

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
export default class OpcionFleteComponent implements OnInit{

  private route = inject(ActivatedRoute)
  private router = inject(Router)

  idProcesoCotizacion: string | null = null;
  idBuque: string | null = null;

  ngOnInit() {
    this.idProcesoCotizacion = this.route.snapshot.paramMap.get('id');
    this.idBuque = this.route.snapshot.paramMap.get('idBuque');

    // Si quieres reaccionar a cambios dinámicos:
    this.route.paramMap.subscribe(params => {
      this.idProcesoCotizacion = params.get('idCotizacion');
      this.idBuque = params.get('idBuque');
      console.log(params)
    });
  }


}
