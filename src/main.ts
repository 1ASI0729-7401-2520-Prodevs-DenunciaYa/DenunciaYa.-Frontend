import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {App} from './app/app';
import { registerLicense } from '@syncfusion/ej2-base';
registerLicense('Ngo9BigBOggjGyl/Vkd+XU9FcVRDXHxPYVF2R2ZJflR0dF9GZUwxOX1dQl9mSH5TcURgXX1deHNRR2RXUkU=');

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
