import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PodcastService, UtilService, LoggerService } from '../../services';
import { Podcast } from '../../models';

@Component({
  selector: 'page-podcasts',
  templateUrl: 'podcasts.html'
})
export class PodcastsPage {

  public podcasts: Podcast[] = [];

  constructor(public navCtrl: NavController, private podcastService: PodcastService, private utilService: UtilService, private logger: LoggerService) {
    this.podcastService.findAll(true).subscribe((podcasts) => {
      this.logger.info('PodcastsPage :: constructor :: podcasts', podcasts);
      this.podcasts = podcasts;
    },(error) => {
      this.logger.error('PodcastsPage :: constructor :: error', error);
    });
  }

  public returnData(podcast: Podcast, tipo: string): string {
    let arquivo: string = this.utilService.retornaNomeArquivo(podcast.imagem);
    let anexo: any = podcast._attachments[arquivo];
    if (tipo === 'content_type') {
      return anexo.content_type;
    }
    if (tipo === 'base64') {
      return anexo.data;
    }
    return '';
  }

}