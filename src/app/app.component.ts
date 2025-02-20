import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PrimeNG} from 'primeng/config';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
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
