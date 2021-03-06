import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PodcastService, UtilService, LoggerService } from '../../services';
import { Podcast } from '../../models';
import { PodcastPage } from '../podcast/podcast';
import { Observable } from "rxjs/Observable";

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
    this.podcastService.findAll(true).subscribe((podcasts: Podcast[]) => {
      if (podcasts.length > 0) {
        this.logger.info('PodcastsPage :: constructor :: podcasts', podcasts);
        this.podcasts = podcasts;
      }
    }, (error) => {
      this.logger.error('PodcastsPage :: constructor :: error', error);
    });
  }

  public returnData(podcast: Podcast, tipo: string): string {
    let arquivo: string = this.utilService.retornaNomeArquivo(podcast.imagem);
    let anexo: any = podcast._attachments[arquivo];
    if (anexo) {
      if (tipo === 'content_type') {
        return anexo.content_type;
      }
      if (tipo === 'base64') {
        return anexo.data;
      }
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
    this.utilService.presentLoading('Sincronizando podcasts');

    this.sincronizacao().subscribe((retorno) => {
      this.utilService.dismissLoading();
    }, (error) => {
      this.logger.error('PodcastsPage :: sincronizar :: error', error);
      this.utilService.dismissLoading();
    });
  }

  private sincronizacao(): Observable<boolean> {
    let retorno: Observable<boolean> = new Observable<boolean>((observer) => {
      this.podcasts.forEach(podcast => {
        this.podcastService.verificarUrl(podcast.feed).subscribe((podcastNovo: Podcast) => {
          this.logger.info('PodcastsPage :: sincronizar :: podcastNovo', podcastNovo);
          if (podcast.episodios.length != podcastNovo.episodios.length) {
            podcast.episodios = podcastNovo.episodios;
            podcast.imagem = podcastNovo.imagem;
            podcast.link = podcastNovo.link;
            podcast.titulo = podcastNovo.titulo;
            this.podcastService.salvarPodcast(podcast).subscribe((retorno) => {
              this.logger.info('PodcastsPage :: sincronizar :: sincronizado :: retorno', retorno);
            }, (error) => {
              this.logger.error('PodcastsPage :: sincronizar :: erro', error);
              observer.error();
              observer.complete;
            });
          }
        }, (error) => {
          this.logger.error('PodcastsPage :: sincronizar :: error', error);
          observer.error();
          observer.complete;
        });
      });
      observer.next(true);
      observer.complete;
    });
    return retorno;
  }

  public detalhe(podcast: Podcast): void {
    this.navCtrl.setRoot(PodcastPage, { podcast: podcast });
  }

}