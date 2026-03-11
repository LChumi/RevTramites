import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {LayoutService} from '@shared/component/services/layout.service';
import {ButtonDirective} from 'primeng/button';
import {Router} from '@angular/router';
import {WsService} from '@services/ws/ws.service';

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
  private notificacionService = inject(WsService);

  constructor() {
  }

  onMenuButtonClick() {
    this.layoutService.onMenuToggle();
  }

  logout() {
    const user = sessionStorage.getItem("username")
    if (user) {
      const message = `El usuario ${user} cerro la sesion`
      this.notificacionService.send("tramites", message.toUpperCase())
    }
    sessionStorage.clear();
    this.router.navigate(['login']).then(r => {
      this.notificacionService.disconnect("tramites")
    });
  }

}
