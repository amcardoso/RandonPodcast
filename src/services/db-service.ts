import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import { Podcast } from '../models';
import { LoggerService } from './logger-service';
import { UtilService } from './util-service';
import { Observable } from "rxjs/Observable";
import { encode } from 'node-base64-image';
import mime from 'mime-types';
declare var emit: any;

@Injectable()
export class DbService {

  private db;
  private podcasts: string = 'podcasts';
  private INDEX: string = 'by_feed';

  constructor(private logger: LoggerService, private utilService: UtilService) {
    this.db = new PouchDB(this.podcasts, {auto_compaction: true});
    // PouchDB.replicate('podcasts', 'http://localhost:5984/podcasts', { live: true });
    this.createDesignDoc(this.INDEX, function mapFunction(doc) {
      if (doc && doc.feed) {
        emit(doc.feed);
      }
    });
  }

  public create(podcast: Podcast): Observable<any> {
    let arquivo: string = this.utilService.retornaNomeArquivo(podcast.imagem);
    let retorno: Observable<any> = new Observable<any>((observer) => {
      encode(podcast.imagem, { string: true, local: false }, (error, retorno) => {
        if (error) {
          this.logger.error('DbService :: create :: error', error);
          return;
        }
        podcast._attachments = {};
        podcast._attachments[arquivo] = {
          content_type: mime.lookup(arquivo),
          data: retorno
        };

        if (podcast._id) {
          this.db.put(podcast).then((retorno: any) => {
            observer.next(retorno);
            observer.complete();
          }).catch((error) => {
            observer.error();
            observer.complete();
          });
        } else {
          this.db.post(podcast).then((retorno: any) => {
            observer.next(retorno);
            observer.complete();
          }).catch((error) => {
            observer.error();
            observer.complete();
          });
        }
      });
    });

    return retorno;
  }

  private createDesignDoc(name, mapFunction): void {
    let ddoc: any = {
      _id: `_design/${name}`,
      views: {
      }
    };
    ddoc.views[name] = { map: mapFunction.toString() };

    this.db.post(ddoc).catch(function (err) {
      if (err.name !== 'conflict') {
        throw err;
      }
    });
  }

  public findByFeed(feed: string): Observable<Podcast> {
    this.logger.info('DbService :: findByFeed :: inicio');
    let resposta: Observable<Podcast> = new Observable<Podcast>((observer) => {
      this.db.query(this.INDEX, { key: feed, include_docs: true }).then((result) => {
        this.logger.info('DbService :: findByFeed :: result', result);
        let podcast: Podcast = new Podcast();
        if (result.rows.length > 0) {
          podcast = result.rows[0].doc;
        }
        observer.next(podcast);
        observer.complete();
      }).catch((err) => {
        observer.error(err);
        observer.complete();
      });
    });
    return resposta;
  }

  public findAll(anexo: boolean): Observable<Podcast[]> {
    this.logger.info('DbService :: findAll :: inicio');
    let resposta: Observable<Podcast[]> = new Observable<Podcast[]>((observer) => {
      this.db.allDocs({ include_docs: true, attachments: anexo }).then((result) => {
        let podcasts: Podcast[] = [];
        result.rows.forEach(row => {
          if (row.doc.feed) {
            podcasts.push(row.doc);
          }
        });
        observer.next(podcasts);
        observer.complete()
      }).catch((error) => {
        observer.error(error);
        observer.complete();
      });
    });
    return resposta;
  }

  public carregarAnexo(id: string, anexo: string): Promise<string> {
    return this.db.getAttachment(id, anexo);
  }

  public apagarPodcast(podcast: Podcast): Promise<any> {
    return this.db.remove(podcast);
  }

}