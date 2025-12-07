import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// sonarjs/prefer-top-level-await: off
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
