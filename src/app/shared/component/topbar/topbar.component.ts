import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {LayoutService} from '@shared/component/services/layout.service';
import {ButtonDirective} from 'primeng/button';
import {Router} from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    ButtonDirective
  ],
  templateUrl: './topbar.component.html',
  styles: ``
})
export class TopbarComponent {
  @ViewChild('menubutton') menuButton!: ElementRef;

  private layoutService = inject(LayoutService)
  private router= inject(Router);

  constructor() {
  }

  onMenuButtonClick() {
    this.layoutService.onMenuToggle();
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['login']).then(r => {});
  }

}
