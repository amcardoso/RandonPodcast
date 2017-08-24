import { Injectable } from '@angular/core';
import { Loading, LoadingController, ToastController } from 'ionic-angular';

@Injectable()
export class UtilService {

  private loader: Loading;
  
  constructor(private loadingCtrl: LoadingController, private toastCtrl: ToastController) {
  }

  public presentLoading(mensagem: string): void {
    this.loader = this.loadingCtrl.create({
      content: mensagem
    });
    this.loader.present();
  }

  public dismissLoading(): void {
    if (this.loader) {
      this.loader.dismiss();
    }
  }

  public presentToast(mensagem: string): void {
    let toast = this.toastCtrl.create({
      message: mensagem,
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }

  public retornaNomeArquivo(url: string): string {
    let diretorios: string[] = url.split('/');
    return diretorios[diretorios.length-1];
  }

}
