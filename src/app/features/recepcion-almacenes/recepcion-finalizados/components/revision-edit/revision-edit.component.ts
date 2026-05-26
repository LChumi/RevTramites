import {Component, inject, OnInit} from '@angular/core';
import {DreposicionService} from '@services/dreposicion.service';
import {CreposicionService} from '@services/creposicion.service';
import {Creposicion, CreposicionID} from '@dtos/creposicion';
import {Dreposicion} from '@dtos/dreposicion';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-revision-edit',
  standalone: true,
  imports: [],
  templateUrl: './revision-edit.component.html',
  styles: ``
})
export default class RevisionEditComponent implements OnInit{

  private dreposicionService = inject(DreposicionService)
  private creposicionService = inject(CreposicionService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private empresaSession = sessionStorage.getItem('idEmpresa') ?? '';
  private usuarioSesion = sessionStorage.getItem('username') ?? '';

  cabecera: Creposicion | null = null;
  lista: Dreposicion[] = []
  crepo!: any
  loading = false

  ngOnInit(): void {
    this.cabecera = null
    this.crepo = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.crepo === '' || this.empresaSession === '') {
      this.router.navigate(['auth', 'login']).then(r => {
        return
      })
    }
    this.getCabecera();
  }

  getCabecera(){
    this.loading = true
    const empresa = Number(this.empresaSession);
    const codigo = Number(this.crepo);
    if (isNaN(empresa) || isNaN(codigo)) {
      console.error("El valor no es numérico");
    }

    const id: CreposicionID = {
      codigo: codigo,
      empresa: empresa
    }
    this.creposicionService.getById(id).subscribe({
      next: value => {
        this.cabecera = value
        this.getDreposicion(value.id)
      }, error: err => {
        console.error(err)
        this.loading = false
      }
    })
  }

  getDreposicion(id: any){
    this.dreposicionService.getListaDreposicion(id).subscribe({
      next: value => {
       this.lista = value
      }
    })
  }

}
