import { Episodio } from "./Episodio";

export class Podcast {
  imagem: string;
  titulo: string;
  link: string;
  feed: string;
  atualizado: boolean;
  episodios: Episodio[];
  syncIcon: string;
  _attachments: any;
  _id: string;
}