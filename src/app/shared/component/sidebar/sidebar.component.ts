import {Component, ElementRef, ViewChild} from '@angular/core';
import {LayoutService} from '@shared/component/services/layout.service';
import {RouterLink} from '@angular/router';
import {MenuComponent} from '@shared/component/menu/menu.component';
import {NgOptimizedImage} from '@angular/common';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MenuComponent,
  ],
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent {
  timeout: any = null;

  @ViewChild('menuContainer') menuContainer!: ElementRef;

  constructor(public layoutService: LayoutService, public el: ElementRef) {
  }


  onMouseEnter() {
    if (!this.layoutService.state.anchored) {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      this.layoutService.state.sidebarActive = true;


    }
  }

  onMouseLeave() {
    if (!this.layoutService.state.anchored) {
      if (!this.timeout) {
        this.timeout = setTimeout(() => this.layoutService.state.sidebarActive = false, 300);
      }
    }
  }

  anchor() {
    this.layoutService.state.anchored = !this.layoutService.state.anchored;
  }
}
