import { Component } from '@angular/core';
import { FotoService } from '../services/foto.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
[x: string]: any;

  constructor(public fotoService: FotoService) {}
  AgregarFotoNueva()
  {
this.fotoService.AgregarFotoNueva()

  }
  async ngOnInit ()

  {
await this.fotoService.CargarFotos()

  }
}
