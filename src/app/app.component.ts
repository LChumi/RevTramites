import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PrimeNG} from 'primeng/config';
import {TranslateService} from '@ngx-translate/core';
import {Toast} from 'primeng/toast';
import {ConfirmDialog} from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, ConfirmDialog],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  private primeng = inject(PrimeNG)
  private transaletService = inject(TranslateService)

  ngOnInit() {
    this.primeng.ripple.set(true)
    this.transaletService.setDefaultLang('es')
  }

  translate(lang: string){
    this.transaletService.use(lang);
    this.transaletService.use('primeng').subscribe(res => this.primeng.setTranslation(res));
  }
}
