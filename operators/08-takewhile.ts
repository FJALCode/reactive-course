import { fromEvent, map, takeWhile, tap } from "rxjs";

const click$ = fromEvent<PointerEvent>(document, 'click');

click$.pipe(
    tap<PointerEvent>(console.log),
    map(({ x, y }) => ({ x, y })),
    // takeWhile(({ y }) => y < 150, true)
    takeWhile(({ y }) => y < 150)
).subscribe({
    next: console.log,
    complete: () => console.log('Complete')
})