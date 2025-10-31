import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SideNavigationBarComponent } from '../side-navigation-bar/side-navigation-bar';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    SideNavigationBarComponent,
    LanguageSwitcher,
    RouterOutlet
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class LayoutComponent {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  isMobile = false;
  collapsed = false;

  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;

    if (this.isMobile && this.sidenav) {
      this.sidenav.close();
      this.collapsed = false;
    } else if (this.sidenav) {
      this.sidenav.open();
    }
  }

  toggleSidenav() {
    if (this.isMobile) {
      this.sidenav.toggle();
    } else {
      this.collapsed = !this.collapsed;
      this.updateSidenavState();
    }
  }

  private updateSidenavState() {
    const container = document.querySelector('.layout-container');
    if (this.collapsed) {
      container?.classList.add('collapsed');
    } else {
      container?.classList.remove('collapsed');
    }
  }

  onSidenavClosed() {
    if (this.isMobile) {
    }
  }
}
