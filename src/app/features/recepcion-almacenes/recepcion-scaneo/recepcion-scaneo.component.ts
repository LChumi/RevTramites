import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-recepcion-scaneo',
  standalone: true,
  imports: [],
  templateUrl: './recepcion-scaneo.component.html',
  styles: ``
})
export default class RecepcionScaneoComponent implements OnInit{

  private route = inject(ActivatedRoute)

  id!: string;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
  }
}
