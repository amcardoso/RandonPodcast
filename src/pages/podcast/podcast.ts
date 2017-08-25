import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PodcastService, UtilService, LoggerService } from '../../services';
import { Podcast } from '../../models';

@Component({
  selector: 'page-podcast',
  templateUrl: 'podcast.html'
})
export class PodcastPage {

  public podcast: Podcast = new Podcast();

  constructor(public navCtrl: NavController, private podcastService: PodcastService, private utilService: UtilService, private logger: LoggerService, private navParams: NavParams) {
    this.podcast = navParams.get('podcast');
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