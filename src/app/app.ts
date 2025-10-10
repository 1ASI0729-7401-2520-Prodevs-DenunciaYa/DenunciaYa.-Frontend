import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {CommunityPage} from './community/presentation/community-page/community-page';
import {LayoutComponent} from './shared/presentation/components/layout/layout';
import { TimelineModule } from '@syncfusion/ej2-angular-layouts';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ LayoutComponent, TimelineModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('learning-center');
  private readonly translate = inject(TranslateService);

  constructor() {
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('en');

    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang?.match(/en|es/) ? browserLang : 'en');
  }
}
