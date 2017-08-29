import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Podcast } from '../../models';
import { PodcastService, UtilService, LoggerService } from '../../services';
import { HomePage } from '../home/home';

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
    this.utilService.presentLoading('Salvando Podcast');
    this.podcastService.salvarPodcast(this.podcast).subscribe((retorno) => {
      this.utilService.dismissLoading();
      this.utilService.presentToast('Podcast adicionado com sucesso');
      this.navCtrl.setRoot(HomePage);
    }, (error) => {
      this.utilService.dismissLoading();
      this.utilService.presentToast('Erro ao salvar o feed');
      this.logger.error('CadastroPage :: salvarPodcast :: error', error);
    });
  }

}