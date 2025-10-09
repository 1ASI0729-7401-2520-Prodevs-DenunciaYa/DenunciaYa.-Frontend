import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { TranslationObject } from '@ngx-translate/core';

import { routes } from './app.routes';
import { MapStore } from './map/application/map.store';
import { DistrictCoordinatesService } from './map/infrastructure/district-coordinates.service';

export class TypedTranslateHttpLoader extends TranslateLoader {
  constructor(private http: HttpClient) {
    super();
  }

  getTranslation(lang: string): Observable<TranslationObject> {
    return this.http.get(`./assets/i18n/${lang}.json`).pipe(
      map((res) => res as TranslationObject)
    );
  }
}

export function HttpLoaderFactory(http: HttpClient): TranslateLoader {
  return new TypedTranslateHttpLoader(http);
}

export const appConfig: ApplicationConfig = {
  providers: [
    // Angular core providers
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),

    provideHttpClient(withFetch()),

    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ),

    MapStore,
    DistrictCoordinatesService,

    {
      provide: 'googleMapsApiKey',
      useValue: 'AIzaSyDRrq_VcuuezEAhyUIBhkAV7iZOVqNDnqA'
    }
  ]
};
