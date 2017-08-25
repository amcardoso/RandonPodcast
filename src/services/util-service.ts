import { Injectable } from '@angular/core';
import { Loading, LoadingController, ToastController, AlertController } from 'ionic-angular';

@Injectable()
export class UtilService {

  private loader: Loading;
  
  constructor(private loadingCtrl: LoadingController, private toastCtrl: ToastController, private alertCtrl: AlertController) {
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

  public presentConfirm (titulo: string, mensagem: string, callback: any) {
    let alert = this.alertCtrl.create({
      title: titulo,
      message: mensagem,
      buttons: [
        {
          text: 'Não',
          handler: () => {
            callback(false);
          }
        },
        {
          text: 'Sim',
          handler: () => {
            callback(true);
          }
        }
      ]
    });

    alert.present();
  }

}
