import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { LoggerService } from './logger-service';
import * as xml2js from 'xml2js';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/timeoutWith';
import { Podcast, Episodio } from '../models';
import { DbService } from './db-service';

@Injectable()
export class PodcastService {
  
  constructor(private http: Http, private logger: LoggerService, private db: DbService) {
  }
  
  // public carregarEpisodios(): void { 
    
  // }

  public verificarUrl(url: string): Observable<Podcast> {
    let resposta: Observable<Podcast> = new Observable<Podcast>((observer) => {
      let podcast: Podcast = new Podcast();
      podcast.episodios = [];
      this.consultarXml(url).subscribe((xml: any) => {
        this.logger.info('PodcastService :: verificarUrl :: xml', xml);
        podcast.feed = xml.rss.channel[0]['atom:link'][0].$.href;
        podcast.imagem = xml.rss.channel[0].image[0].url[0];
        podcast.link = xml.rss.channel[0].image[0].link[0];
        podcast.titulo = xml.rss.channel[0].title[0];
        xml.rss.channel[0].item.forEach(element => {
          let episodio: Episodio = new Episodio();
          if (element['itunes:image']) {
            episodio.arte = element['itunes:image'][0].$.href;
          }
          episodio.descricao = element.description[0];
          episodio.link = element.link[0];
          episodio.titulo = element.title[0];
          podcast.episodios.push(episodio);
        });
        this.logger.info('PodcastService :: verificarUrl :: podcast', podcast);
        observer.next(podcast);
        observer.complete();
      }, (error) => {
        this.logger.error('Erro durante a verificacao de url: ', error);
        observer.error(error);
        observer.complete();
      });
    });
    return resposta;
  }

  private consultarXml(url: string): Observable<any> {
    let resposta: Observable<any> = new Observable<any>((observer) => {
      this.http.get(url).timeoutWith(10000, Observable.throw( new Error('Tempo Excedido!'))) .subscribe((response: Response) => {
        this.logger.info('response: ', response);
        xml2js.parseString(response.text(), function(err, result) {
          observer.next(result);
          observer.complete();
        });
      }, (error) => {
        this.logger.info('Error: ', error);
        observer.error(error);
        observer.complete();
      });
    });
    return resposta;
  }

  public salvarPodcast(podcast: Podcast):Promise<any> {
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
}