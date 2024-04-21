import { range } from "rxjs";
import { map, tap } from "rxjs/operators";

const numeros$ = range(1,9);

numeros$.pipe(
    tap(x => console.log),
    map(val => val * 10),
    tap({
        next: val => console.log('Antes', val),
        complete: () => console.log('Complete')
    })
).subscribe(console.log)