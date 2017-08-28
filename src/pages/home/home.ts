import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Podcast, Episodio } from '../../models';
import { PodcastService, LoggerService, UtilService } from '../../services';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public podcast: Podcast = new Podcast();
  public episodio: Episodio = new Episodio();
  public imagem: string;
  public content_type: string;
  public data: string[] = ['',''];

  constructor(public navCtrl: NavController, private podcastService: PodcastService, private logger: LoggerService, private utilService: UtilService) {
    this.imagem = 'assets/podcast.png';
  }

  public sortear(): void {
    this.utilService.presentLoading('Escolhendo episódio');
    this.podcastService.findAll(true).subscribe((podcasts: Podcast[]) => {
      if (podcasts.length > 0) {
        this.podcast = podcasts[Math.round(Math.random()*(podcasts.length - 1))];
        this.episodio = this.podcast.episodios[Math.round(Math.random()*(this.podcast.episodios.length - 1))];
        let arquivo: string = this.utilService.retornaNomeArquivo(this.podcast.imagem);
        let anexo: any = this.podcast._attachments[arquivo];
        this.imagem = anexo.data;
        this.content_type = anexo.content_type;
        this.data[0] = 'data:';
        this.data[1] = ';base64,';
        this.utilService.dismissLoading();
      }
    }, (error) => {
      this.utilService.dismissLoading();
      this.logger.error('HomePage :: sortear :: error', error);
    });
  }

}