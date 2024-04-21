import { from, range } from "rxjs";
import { filter, map } from "rxjs/operators";



range(1, 10).pipe(
    filter<number>(a => a == 1)
).subscribe(console.log)

interface Personaje {
    tipo: string;
    nombre: string;
}

const personajes: Personaje[] = [
    {
        tipo: 'heroe',
        nombre: 'Batman'
    },
    {
        tipo: 'heroe',
        nombre: 'Robin'
    },
    {
        tipo: 'villano',
        nombre: 'Joker'
    }
]


const personajes$ = from(personajes).
    pipe(
        filter(val => val.tipo === "heroe"),
        map(name => name.nombre)
    )

personajes$.subscribe(console.log)