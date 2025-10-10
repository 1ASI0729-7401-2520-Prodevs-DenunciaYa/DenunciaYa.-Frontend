import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Output, EventEmitter } from '@angular/core';

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css'
})
export class LanguageSwitcher {
  protected languages: LanguageOption[] = [
    { code: 'es', name: 'Español', flag: '' },
    { code: 'en', name: 'English', flag: '' }
  ];

  protected currentLang: string = 'en';
  private translate = inject(TranslateService);

  constructor() {
    const browserLang = this.translate.getBrowserLang();
    const defaultLang = this.languages.find(l => l.code === browserLang)?.code || 'es';
    this.translate.addLangs(this.languages.map(l => l.code));
    this.translate.setDefaultLang(defaultLang);
    this.translate.use(defaultLang);
    this.currentLang = defaultLang;

  }

  /** Método que devuelve el idioma actual (usado en el template) */
  get currentLanguage(): LanguageOption {
    return this.languages.find(lang => lang.code === this.currentLang)!;
  }
  @Output() languageChanged = new EventEmitter<string>();

  useLanguage(langCode: string) {
    this.translate.use(langCode);
    this.currentLang = langCode;
    this.languageChanged.emit(langCode);
  }
}
