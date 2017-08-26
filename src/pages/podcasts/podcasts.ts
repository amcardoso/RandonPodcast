import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PodcastService, UtilService, LoggerService } from '../../services';
import { Podcast } from '../../models';
import { PodcastPage } from '../podcast/podcast';

@Component({
  selector: 'page-podcasts',
  templateUrl: 'podcasts.html'
})
export class PodcastsPage {

  public podcasts: Podcast[] = [];

  constructor(public navCtrl: NavController, private podcastService: PodcastService, private utilService: UtilService, private logger: LoggerService) {
    this.listarTodos();
  }

  private listarTodos(): void {
    this.podcastService.findAll(true).subscribe((podcasts) => {
      this.logger.info('PodcastsPage :: constructor :: podcasts', podcasts);
      this.podcasts = podcasts;
      this.sincronizar();
    }, (error) => {
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

  public deletar(podcast: Podcast): void {
    this.utilService.presentConfirm('Exclusão', 'Apagar registro?', (resposta) => {
      this.logger.info('PodcastsPage :: deletar: resposta', resposta);
      if (resposta) {
        this.podcastService.apagarPodcast(podcast).then((retorno) => {
          this.listarTodos();
        }).catch((error) => {
          this.logger.error('PodcastsPage :: deletar :: error', error);
        });
      }
    })
  }

  public sincronizar(): void {
    for (let i in this.podcasts) {
      this.podcasts[i].syncIcon = 'sync';
      this.podcastService.verificarUrl(this.podcasts[i].feed).subscribe((podcastNovo: Podcast) => {
        this.logger.info('PodcastsPage :: sincronizar :: podcastNovo', podcastNovo);
        this.podcasts[i].episodios = podcastNovo.episodios;
        this.podcasts[i].imagem = podcastNovo.imagem;
        this.podcasts[i].link = podcastNovo.link;
        this.podcasts[i].titulo = podcastNovo.titulo;
        if (this.podcasts[i].episodios.length != podcastNovo.episodios.length) {
          this.podcastService.salvarPodcast(this.podcasts[i]).subscribe((retorno) => {
            this.logger.info('PodcastsPage :: sincronizar :: retorno', retorno);
            this.podcasts[i].syncIcon = 'checkmark-circle';
          }, (error) => {
            this.logger.error('PodcastsPage :: sincronizar :: erro', error);
            this.podcasts[i].syncIcon = 'alert';
          });
        } else {
          this.podcasts[i].syncIcon = 'checkmark-circle';
        }
      }, (error) => {
        this.logger.error('PodcastsPage :: sincronizar :: error', error);
        this.podcasts[i].syncIcon = 'alert';
      });
    }
  }

  public detalhe(podcast: Podcast): void {
    this.navCtrl.setRoot(PodcastPage, { podcast: podcast });
  }

}