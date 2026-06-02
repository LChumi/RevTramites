import {Component, inject, OnInit} from '@angular/core';
import {PuertoEmbarqueService} from '@services/embarque/puerto-embarque.service';
import {ConsignatarioService} from '@services/embarque/consignatario.service';
import {PuertoEmbarque} from '@models/embarque/puerto-embarque';
import {Consignatario} from '@models/embarque/consignatario';
import {MessageService} from 'primeng/api';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonDirective} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {TabViewModule} from 'primeng/tabview';

@Component({
  selector: 'app-puerto-consignatario',
  standalone: true,
  imports: [
    CardModule,
    InputTextModule,
    ButtonDirective,
    FormsModule,
    TableModule,
    TabViewModule
  ],
  templateUrl: './puerto-consignatario.component.html',
  styles: ``
})
export default class PuertoConsignatarioComponent implements OnInit{

  private puertoService = inject(PuertoEmbarqueService)
  private consignatarioService = inject(ConsignatarioService)
  private messageService = inject(MessageService)

  puertos: PuertoEmbarque[] = []
  consignatarios: Consignatario[] = []

  nombrePuerto: string = ''
  nombreConsignatario: string = ''

  ngOnInit() {
    this.listarPuerto();
    this.listarConsignatarios();
  }

  listarPuerto(){
    this.puertoService.list().subscribe({
      next: value => this.puertos = value
    })
  }

  listarConsignatarios() {
    this.consignatarioService.list().subscribe({
      next: value => this.consignatarios = value
    })
  }

  crearPuerto(){
    if (this.nombrePuerto === ''){
      this.messageService.add({severity: 'warn', detail: 'Nombre puerto vacío'})
      return;
    }
    const puerto: PuertoEmbarque = {
      nombre: this.nombrePuerto.toLocaleUpperCase()
    }

    this.puertoService.save(puerto).subscribe({
      next: value => {
        this.messageService.add({
          severity: 'info',
          detail: `PUERTO ${value.nombre} CREADO CORRECTAMENTE`,
        })
        this.puertos.push(value)
        this.nombrePuerto = ''
      }
    })
  }

  crearConsignatario(){
    if (this.nombreConsignatario === ''){
      this.messageService.add({severity: 'warn', detail: 'Nombre consignatario vacío'})
      return;
    }
    const consig: Consignatario = {
      nombre: this.nombreConsignatario.toLocaleUpperCase()
    }

    this.consignatarioService.save(consig).subscribe({
      next: value => {
        this.messageService.add({
          severity: 'info',
          detail: `CONSIGNATARIO ${value.nombre} CREADO CORRECTAMENTE`,
        })
        this.consignatarios.push(value)
        this.nombreConsignatario = ''
      }
    })
  }

}
