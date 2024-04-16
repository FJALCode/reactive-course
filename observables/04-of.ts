import { of } from "rxjs";

const obs$ = of<number[]>(1,2,3,4,5,6);

obs$.subscribe({
    next: next => console.log('Next: ', next),
    error: error => console.warn('Error: ', error),
    complete: () => console.log('Terminamos la secuencia')
})

const obs2$ = of<number[]>(...[1,2,3,4,5,6]);

obs2$.subscribe({
    next: next => console.log('Next: ', next),
    error: error => console.warn('Error: ', error),
    complete: () => console.log('Terminamos la secuencia')
})