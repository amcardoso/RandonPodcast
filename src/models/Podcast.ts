import { Episodio } from "./Episodio";

export class Podcast {
  imagem: string;
  titulo: string;
  link: string;
  feed: string;
  episodios: Episodio[];
  _attachments: any;
  _id: string;
}