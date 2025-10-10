import { Component } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule, MatNavList, MatListItem } from '@angular/material/list';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface SideNavigationItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-side-navigation-bar',
  standalone: true,
  templateUrl: './side-navigation-bar.html',
  styleUrls: ['./side-navigation-bar.css'],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatNavList,
    MatListItem,
    NgForOf,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    TranslateModule
  ]
})
export class SideNavigationBarComponent {
  collapsed = false;

  sidenavItems: SideNavigationItem[] = [

    { label: 'SIDENAV.HOME', icon: 'home', route: '/authority/home' },
    { label: 'SIDENAV.REPORTS', icon: 'report_problem', route: '/pages/complainList' },
    { label: 'SIDENAV.MAP', icon: 'map', route: '/pages/map' },
    { label: 'SIDENAV.METRICS', icon: 'bar_chart', route: 'pages/metrics' },
    { label: 'SIDENAV.TEAMS', icon: 'groups', route: '/pages/teamManagment' },
    //{ label: 'SIDENAV.SUPPORT', icon: 'help_outline', route: '/soporte' },
    //{ label: 'SIDENAV.DIRECTORY', icon: 'menu_book', route: '/directorio' },
    { label: 'SIDENAV.COMMUNITY', icon: 'forum', route: '/pages/community' },
    { label: 'SIDENAV.CREATERESPONSIBLE', icon: 'star', route: 'pages/responsibleCreate' },
    { label: 'SIDENAV.SETTINGS', icon: 'settings', route: '/pages/settings' },
    { label: 'SIDENAV.PROFILE', icon: 'person', route: '/pages/profile' },
    { label: 'SIDENAV.LOGOUT', icon: 'logout', route: '/cerrar-cuenta' }

  ];

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('es');
    this.translate.use('es');
  }

  toggleSidenav() {
    this.collapsed = !this.collapsed;
  }
}
