import { Injectable } from '@angular/core';
import { Camera, CameraPhoto, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FotoI } from '../models/foto.interface'; 

import { Storage } from '@capacitor/storage';
import { IonDatetime } from '@ionic/angular';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FotoService {

  public fotos: FotoI[] = [];
  private ALMACENAMIENTO_FOTOS: string = "fotos";

  constructor() { }

  public async AgregarFotoNueva() {
    try {
      const FotoN: CameraPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100
      });
      const ImagenGuardada = await this.GuardarFoto(FotoN);
      this.fotos.unshift(ImagenGuardada);
      Storage.set
      ({
        key: this.ALMACENAMIENTO_FOTOS,
        value: JSON.stringify(this.fotos)
      });
     

    } catch (error) {
      console.error('Error tomando foto:', error);

    }
  }

  public async GuardarFoto(cameraPhoto: CameraPhoto): Promise<FotoI> {
    const Codificado64 = await this.CodificarBlobBase64(cameraPhoto);
    const NombreFoto = new Date().getTime() + '.jpeg';

    const ArchivoGuardado = await Filesystem.writeFile({
      path: NombreFoto,
      data: Codificado64,
      directory: Directory.Data
    });

    return {
      filepath: NombreFoto,
      webviewPath: cameraPhoto.webPath
    };
  }

  public async CodificarBlobBase64(cameraPhoto: CameraPhoto): Promise<string> {
    const respuesta = await fetch(cameraPhoto.webPath!);
    const blob = await respuesta.blob();
    return await this.convertirBlobaBase64(blob) as string;
  }

  async convertirBlobaBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const lector = new FileReader();
      lector.onerror = reject;
      lector.onload = () => resolve(lector.result as string); 
      lector.readAsDataURL(blob);
    });
  }

  public async CargarFotos()
  {
    const listaFotos = await Storage.get ({key: this.ALMACENAMIENTO_FOTOS})
   // this.fotos =  JSON.parse(listaFotos.value) || []
    this.fotos = typeof listaFotos.value === 'string' ? JSON.parse(listaFotos.value) : [];

    for (let foto of this.fotos)
    {
const LeerArchivo = await Filesystem.readFile({
path : foto.filepath,
directory: Directory.Data
  })
  foto.webviewPath = `data:image/jpeg;base64,${LeerArchivo.data}`

}
}
}