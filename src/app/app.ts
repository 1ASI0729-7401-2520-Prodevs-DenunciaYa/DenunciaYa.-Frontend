import {Component, inject, signal} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {
  ResponsibleCreateComponent
} from './authorities-panel/presentation/responsible-create.component.ts/responsible-create.component';
import {ProfileResponsibleComponent} from './authorities-panel/presentation/profile-responsible/profile-responsible';

@Component({
  selector: 'app-root',
  imports: [
    ResponsibleCreateComponent,
    ProfileResponsibleComponent

  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('learning-center');
  private translate: TranslateService;

  constructor() {
    this.translate = inject(TranslateService);
    this.translate.addLangs(['en', 'es']);
    this.translate.use('en');
  }
}
