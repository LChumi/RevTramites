import {Component, inject, OnInit} from '@angular/core';
import {TramiteEmbarque} from '@models/embarque/tramite-embarque';
import {TableModule} from 'primeng/table';
import {DatePipe} from '@angular/common';
import {TramiteEmbarqueService} from '@services/embarque/tramite-embarque.service';

@Component({
  selector: 'app-lista-tramites',
  standalone: true,
  imports: [
    TableModule,
    DatePipe
  ],
  templateUrl: './lista-tramites.component.html',
  styles: ``
})
export default class ListaTramitesComponent implements OnInit{

  private embarquesService = inject(TramiteEmbarqueService);

  tramites: TramiteEmbarque[] = [];

  ngOnInit(): void {
    this.embarquesService.list().subscribe({
      next: result => {
        this.tramites = result;
      }
    })
  }
}
