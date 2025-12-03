import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { TranslationObject } from '@ngx-translate/core';
import { GoogleMapsModule } from '@angular/google-maps';
import {environment} from '../environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptor';

export class TypedTranslateHttpLoader extends TranslateHttpLoader implements TranslateLoader {
  override getTranslation(lang: string): Observable<TranslationObject> {
    return super.getTranslation(lang).pipe(
      map((res) => res as TranslationObject)
    );
  }
}

export function HttpLoaderFactory(http: HttpClient): TranslateLoader {
  return new TypedTranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),

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
    GoogleMapsModule,
    { provide: 'googleMapsApiKey', useValue: environment.googleMapsApiKey },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }

  ]
};
