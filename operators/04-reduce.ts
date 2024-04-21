import { interval, reduce, take, tap } from "rxjs";

const totalReducer = (acumulador: number, valorActual: number) => {
    return acumulador + valorActual;
}

interval(500).pipe(
    take(6),
    tap(console.log),
    reduce(totalReducer)
).subscribe({
    next: val => console.log('next', val),
    complete: () => console.log('Complete')
})