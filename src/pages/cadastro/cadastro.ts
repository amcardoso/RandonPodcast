import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Podcast } from '../../models';
import { PodcastService, UtilService, LoggerService } from '../../services';
import { HomePage } from '../home/home';
import { encode } from 'node-base64-image';
import mime from 'mime-types';

@Component({
  selector: 'page-cadastro',
  templateUrl: 'cadastro.html'
})
export class CadastroPage {

  public podcast: Podcast = new Podcast();
  public urlCadastro: string = '';
  public enderecoAlterado: boolean = true;
  public salvarDesabilitado: boolean = false;

  constructor(public navCtrl: NavController, private podcastService: PodcastService, private utilService: UtilService, private logger: LoggerService) {
    this.podcast.imagem = 'assets/podcast.png';
    this.podcast.feed = '';
  }

  public verificarUrl(): void {
    this.utilService.presentLoading('Verificando URL');
    this.podcastService.verificarUrl(this.urlCadastro).subscribe((podcast: Podcast) => {
      this.podcast = podcast;
      this.urlCadastro = this.podcast.feed;
      this.enderecoAlterado = false;
      this.podcastService.findByFeed(this.podcast.feed).subscribe((podcastBd: Podcast) => {
        this.logger.info('CadastroPage :: verificarUrl :: podcastBd', podcastBd);
        if (podcastBd.feed) {
          this.salvarDesabilitado = true;
        } else {
          this.salvarDesabilitado = false;
        }
        this.utilService.dismissLoading();
      }, (error) => {
        this.utilService.dismissLoading();
        this.utilService.presentToast('Erro durante a verificação do feed');
        this.logger.error('CadastroPage :: verificarUrl :: error', error);
      });
    }, (error) => {
      this.utilService.dismissLoading();
      this.utilService.presentToast('Erro durante a verificação do feed');
      this.logger.error(error);
    });
  }

  public verificarEnderecoAlterado(): void {
    this.logger.info('CadastroPage :: verificarEnderecoAlterado :: inicio :: ', this.podcast.feed !== this.urlCadastro);
    if (this.urlCadastro.length == 0) {
      this.enderecoAlterado = true;
    } else {
      this.enderecoAlterado = (this.podcast.feed !== this.urlCadastro);
    }
  }

  public salvarPodcast(): void {
    let arquivo: string = this.utilService.retornaNomeArquivo(this.podcast.imagem);
    this.utilService.presentLoading('Salvando Podcast');
    encode(this.podcast.imagem, { string: true, local: false }, (error, retorno) => {
      if (error) {
        this.utilService.dismissLoading();
        this.utilService.presentToast('Erro ao salvar o feed');
        this.logger.error('CadastroPage :: verificarEnderecoAlterado :: error', error);
        return;
      }
      this.podcast._attachments = {};
      this.podcast._attachments[arquivo] = {
        content_type: mime.lookup(arquivo),
        data: retorno
      };
      this.podcastService.salvarPodcast(this.podcast).then((retorno: any) => {
        this.utilService.dismissLoading();
        this.utilService.presentToast('Podcast adicionado com sucesso');
        this.navCtrl.setRoot(HomePage);
      }).catch((error) => {
        this.utilService.dismissLoading();
        this.utilService.presentToast('Erro ao salvar o feed');
      });
    });

  }

}