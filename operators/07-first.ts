import { first, fromEvent, tap } from "rxjs";


const click$ = fromEvent<PointerEvent>(document, 'click');

click$.pipe(
    tap(console.log),
    first<PointerEvent>(val => val.clientX > 200)
).
subscribe(console.log)