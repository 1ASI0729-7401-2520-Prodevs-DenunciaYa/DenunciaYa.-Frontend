import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-side-navigation-bar',
  standalone: true,
  templateUrl: './side-navigation-bar.html',
  styleUrls: ['./side-navigation-bar.css'],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    TranslateModule
  ]
})
export class SideNavigationBarComponent {
  collapsed = false; // controla si el sidenav está colapsado

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('es');
    this.translate.use('es');
  }

  toggleSidenav() {
    this.collapsed = !this.collapsed;
  }
}
