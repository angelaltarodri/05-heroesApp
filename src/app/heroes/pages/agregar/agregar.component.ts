import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';

import { Heroe, Publisher } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.scss']
})
export class AgregarComponent implements OnInit {
  publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics'
    }
  ]

  heroe: Heroe = {
    superhero: '',
    publisher: Publisher.DCComics,
    alter_ego: '',
    first_appearance: '',
    characters: ''
  }

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {

    if(!this.router.url.includes('editar')){
      return ;
    }

    this.activatedRoute.params
      .pipe(
        switchMap( ({id}) => this.heroesService.getHeroeById(id))
      )
      .subscribe( heroe => this.heroe = heroe)


  }

  guardar () {
    if (this.heroe.superhero.trim().length === 0) {
      return;
    }
    if (this.heroe.id) {
      this.heroesService.actualizarHeroe(this.heroe)
        .subscribe( heroe => this.mostrarSnackBar('Registro actualizado.'))
    } else {
      this.heroesService.agregarHeroe(this.heroe)
        .subscribe( heroe => {
          this.router.navigate(['/heroes/editar', heroe.id])
          this.mostrarSnackBar('Registro creado.')
        })
    }

  }

  borrar() {

    const dialog = this.dialog.open(ConfirmarComponent, {
      // width:'260px'
      data: {...this.heroe}
    });

    dialog.afterClosed().pipe(
      filter(res => !!res), // Solo proceder si se confirmó la eliminación
      switchMap(() => this.heroesService.borrarHeroe(this.heroe.id!))
    ).subscribe(() => {
      this.router.navigate(['/heroes']);
    });

  }

  mostrarSnackBar( mensaje: string ) {
    this.snackBar.open(mensaje, 'ok!', {
      duration: 2500
    })
  }

}
