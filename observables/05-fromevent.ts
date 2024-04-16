import { Observer, fromEvent } from "rxjs";

const src1$ = fromEvent<PointerEvent>( document, 'click');
const src2$ = fromEvent<KeyboardEvent>( document, 'keyup');

const observer: Observer<any> = {
    next: next => console.log('Next: ', next),
    error: error => console.warn('Error: ', error),
    complete: () => console.log('Terminamos la secuencia')
}

src1$.subscribe(observer);
src2$.subscribe(event => {
    console.log(event.key);
});