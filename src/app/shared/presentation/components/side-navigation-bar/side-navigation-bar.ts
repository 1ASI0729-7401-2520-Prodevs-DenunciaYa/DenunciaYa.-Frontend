import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule, MatNavList, MatListItem } from '@angular/material/list';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {AuthService} from '../../../../authentication-and-account-management/infrastructure/auth.service';

interface SideNavigationItem {
  label: string;
  icon: string;
  route: string;
  roles: ('citizen' | 'authority' | 'responsibles')[];
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
export class SideNavigationBarComponent implements OnInit {
  collapsed = false;
  currentUserRole: 'citizen' | 'authority' | 'responsibles' | null = null;
  @Output() navItemClicked = new EventEmitter<void>();

  allSidenavItems: SideNavigationItem[] = [
    { label: 'SIDENAV.HOME', icon: 'home', route: '/home', roles: ['citizen', 'authority', 'responsibles'] },
    { label: 'SIDENAV.REPORTS', icon: 'report_problem', route: '/complaint-list', roles: ['citizen', 'authority', 'responsibles'] },
    { label: 'SIDENAV.MAP', icon: 'map', route: '/map', roles: ['authority', 'responsibles'] },
    { label: 'SIDENAV.METRICS', icon: 'bar_chart', route: '/metrics', roles: ['authority', 'responsibles'] },
    { label: 'SIDENAV.TEAMS', icon: 'groups', route: '/team-managment', roles: ['authority', 'responsibles'] },
    { label: 'SIDENAV.SUPPORT', icon: 'help_outline', route: '/support', roles: ['citizen', 'authority', 'responsibles'] },
    { label: 'SIDENAV.COMMUNITY', icon: 'forum', route: '/community', roles: ['citizen', 'authority', 'responsibles'] },
    { label: 'SIDENAV.PROFILE', icon: 'person', route: '/profile', roles: ['citizen', 'authority', 'responsibles'] },
    { label: 'SIDENAV.SETTINGS', icon: 'settings', route: '/settings', roles: ['citizen', 'authority', 'responsibles'] },
    { label: 'SIDENAV.LOGOUT', icon: 'logout', route: '/cerrar-cuenta', roles: ['citizen', 'authority', 'responsibles'] },
  ];

  mainNavItems: SideNavigationItem[] = [];
  bottomNavItems: SideNavigationItem[] = [];

  constructor(
    private translate: TranslateService,
    private router: Router,
    private authService: AuthService
  ) {
    this.translate.setDefaultLang('es');
    this.translate.use('es');
  }

  ngOnInit(): void {
    this.loadUserRole();
  }

  private loadUserRole(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentUserRole = currentUser.role;
      this.filterSidenavItems();
    } else {
      this.currentUserRole = 'citizen';
      this.filterSidenavItems();
    }
  }

  private filterSidenavItems(): void {
    if (this.currentUserRole) {
      const filteredItems = this.allSidenavItems.filter(item =>
        item.roles.includes(this.currentUserRole!)
      );

      this.bottomNavItems = filteredItems.slice(-3);
      this.mainNavItems = filteredItems.slice(0, -3);
    } else {
      const filteredItems = this.allSidenavItems.filter(item =>
        item.roles.includes('citizen')
      );
      this.bottomNavItems = filteredItems.slice(-3);
      this.mainNavItems = filteredItems.slice(0, -3);
    }
  }


  navigateToHome() {
    this.router.navigate(['/home']);
  }



  onNavItemClick() {
    if (window.innerWidth <= 768) {
      this.navItemClicked.emit();
    }
  }

}
