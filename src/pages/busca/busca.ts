import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PodcastService, UtilService, LoggerService } from '../../services';
import { Podcast } from '../../models';
import { PodcastPage } from '../podcast/podcast';

@Component({
  selector: 'page-busca',
  templateUrl: 'busca.html'
})
export class BuscaPage {

  public criterio: string;
  public podcastsItunes: any[] = [];

  constructor(public navCtrl: NavController, private podcastService: PodcastService, private utilService: UtilService, private logger: LoggerService) {
  }

  public pesquisar(): void {
    this.utilService.presentLoading('Pesquisando');
    this.podcastService.pesquisarItunes(this.criterio).subscribe((resultado) => {
      this.logger.info('BuscaPage :: pesquisar :: resultado', resultado);
      this.podcastsItunes = resultado.results;
      this.utilService.dismissLoading();
    }, (error) => {
      this.logger.error('BuscaPage :: pesquisar :: error', error);
      this.utilService.dismissLoading();
    });
  }

}