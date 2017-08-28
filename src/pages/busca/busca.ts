import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PodcastService, UtilService, LoggerService } from '../../services';
import { Podcast } from '../../models';
import { HomePage } from '../home/home';

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

  public incluir(feed: string): void {
    this.utilService.presentConfirm('Inclusão', 'Incluir podcast?', (confirmacao) => {
      if (confirmacao) {
        this.utilService.presentLoading('Incluindo podcast');
        this.podcastService.verificarUrl(feed).subscribe((podcast: Podcast) => {
          this.podcastService.salvarPodcast(podcast).subscribe((resultado) => {
            this.logger.info('BuscaPage :: incluir :: resultado', resultado);
            this.utilService.dismissLoading();
            this.utilService.presentToast('Podcast incluido com sucesso');
            this.navCtrl.setRoot(HomePage);
          }, (error) => {
            this.logger.error('BuscaPage :: incluir :: error', error);
            this.utilService.dismissLoading();
            this.utilService.presentToast('Falha na inclusão');
          });
        }, (error) => {
          this.logger.error('BuscaPage :: incluir :: error', error);
          this.utilService.dismissLoading();
          this.utilService.presentToast('Falha na inclusão');
        });
      }
    })
  }

}