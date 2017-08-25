import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LoggerService } from './logger-service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/timeoutWith';
import { Podcast, Episodio } from '../models';
import { DbService } from './db-service';
import * as parsePodcast from 'node-podcast-parser';

@Injectable()
export class PodcastService {

  constructor(private http: Http, private logger: LoggerService, private db: DbService) {
  }

  public verificarUrl(url: string): Observable<Podcast> {
    let resposta: Observable<Podcast> = new Observable<Podcast>((observer) => {
      let podcast: Podcast = new Podcast();
      podcast.episodios = [];
      this.http.get(url).timeoutWith(10000, Observable.throw(new Error('Tempo Excedido!'))).subscribe((xml) => {
        this.logger.info('PodcastService :: verificarUrl :: xml', xml);

        parsePodcast(xml._body, (err, data) => {
          if (err) {
            this.logger.error('PodcastService :: verificarUrl :: error', err);
            return;
          }
          this.logger.info('PodcastService :: verificarUrl :: data', data);

          podcast.feed = url;
          podcast.imagem = data.image;
          podcast.link = data.link;
          podcast.titulo = data.title;
          data.episodes.forEach(element => {
            let episodio: Episodio = new Episodio();
            episodio.arte = element.image;
            episodio.descricao = element.description;
            episodio.titulo = element.title;
            podcast.episodios.push(episodio);
          });
          observer.next(podcast);
          observer.complete();
        });

      }, (error) => {
        this.logger.error('Erro durante a verificacao de url: ', error);
        observer.error(error);
        observer.complete();
      });
    });
    return resposta;
  }

  public salvarPodcast(podcast: Podcast): Promise<any> {
    return this.db.create(podcast);
  }

  public findByFeed(feed: string): Observable<Podcast> {
    return this.db.findByFeed(feed);
  }

  public findAll(anexo: boolean): Observable<Podcast[]> {
    return this.db.findAll(anexo);
  }

  public carregarAnexo(id: string, anexo: string): Promise<string> {
    return this.db.carregarAnexo(id, anexo);
  }

  public apagarPodcast(podcast: Podcast): Promise<any> {
    return this.db.apagarPodcast(podcast);
  }
}