import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommunityPage } from './community/presentation/community-page/community-page';
import { LayoutComponent } from './shared/presentation/components/layout/layout';
import { ResponsibleCreateComponent } from './authorities-panel/presentation/responsible-create.component.ts/responsible-create.component';
import { ProfileResponsibleComponent } from './authorities-panel/presentation/profile-responsible/profile-responsible';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    LayoutComponent,
    ProfileResponsibleComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('denunciaya-frontend');
  private readonly translate = inject(TranslateService);

  constructor() {
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('en');

    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang?.match(/en|es/) ? browserLang : 'en');
  }
}
