import {Component, inject, OnInit} from '@angular/core';
import {Button, ButtonDirective} from "primeng/button";
import {DatePipe} from "@angular/common";
import {DropdownModule} from "primeng/dropdown";
import {PrimeTemplate} from "primeng/api";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {TableModule} from "primeng/table";
import {CreposicionService} from '@services/creposicion.service';
import {Creposicion} from '@dtos/creposicion';
import {SidebarService} from '@services/state/sidebar.service';
import {Ripple} from 'primeng/ripple';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-recepcion-registrados',
  standalone: true,
  imports: [
    DatePipe,
    DropdownModule,
    PrimeTemplate,
    ProgressSpinnerModule,
    TableModule,
    ButtonDirective,
    Ripple
  ],
  templateUrl: './recepcion-registrados.component.html',
  styles: ``
})
export default class RecepcionRegistradosComponent implements OnInit {

  private creposicionService = inject(CreposicionService);
  private usrId = sessionStorage.getItem('usrId') ?? '';
  private empresa = sessionStorage.getItem('idEmpresa') ?? '';
  private sidebarService = inject(SidebarService)
  private router = inject(Router);
  private route = inject(ActivatedRoute)

  registrados: Creposicion[] = [];

  loading = false;

  ngOnInit(): void {
    if (this.empresa == '' || this.usrId == '') {
      alert("Vuelva a iniciar sesion")
    }
    this.listarRegistrados();
  }

  private listarRegistrados() {
    this.creposicionService.getCreposicionByUser(8, this.usrId, 0).subscribe({
      next: (result) => {
        this.registrados = result;
        this.sidebarService.update({registrados: this.registrados.length})
      }
    })
  }

  seleccionarRevision(c: Creposicion) {
    this.router.navigate(['scaneo', c.id.codigo], {relativeTo: this.route}).then(r => {
    })
  }

}
