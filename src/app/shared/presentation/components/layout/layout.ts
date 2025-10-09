import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import {SideNavigationBarComponent} from '../side-navigation-bar/side-navigation-bar';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import {CommunityPage} from '../../../../community/presentation/community-page/community-page';
import {RouterOutlet} from '@angular/router';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    SideNavigationBarComponent,
    LanguageSwitcher,
    RouterOutlet
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class LayoutComponent {}
