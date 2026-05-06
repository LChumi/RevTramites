import {Component, inject, OnInit} from '@angular/core';
import {MenuitemComponent} from '@shared/component/menuitem/menuitem.component';
import {MenuService} from '@services/menu.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MenuitemComponent
  ],
  templateUrl: './menu.component.html',
  styles: ``
})
export class MenuComponent implements OnInit{

  private menuService = inject(MenuService)

  model: any[] =[]

  ngOnInit(): void {
    const usrId = sessionStorage.getItem('usrId');
    if (usrId){
      this.menuService.getMenu(usrId).subscribe({
        next: menu => {
          this.model = menu;
        }
      })
    }
  }

}
