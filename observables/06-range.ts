import { asyncScheduler, range } from "rxjs";

const src$ = range(3);
const src2$ = range(5,3);
const src3$ = range(5,3, asyncScheduler);

console.log('Inicio src$');
src$.subscribe(console.log)
console.log('Fin src$');


console.log('Inicio src2$');
src2$.subscribe(console.log)
console.log('Fin src2$');

console.log('Inicio src3$');
src3$.subscribe(console.log)
console.log('Fin src3$');

