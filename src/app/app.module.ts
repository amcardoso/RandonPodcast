import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CadastroPage } from '../pages/cadastro/cadastro';
import { PodcastsPage } from '../pages/podcasts/podcasts';
import { PodcastPage } from '../pages/podcast/podcast';
import { BuscaPage } from '../pages/busca/busca';

import { DbService, LoggerService, PodcastService, UtilService } from '../services';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CadastroPage,
    PodcastsPage,
    PodcastPage,
    BuscaPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CadastroPage,
    PodcastsPage,
    PodcastPage,
    BuscaPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DbService,
    LoggerService,
    PodcastService,
    UtilService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
