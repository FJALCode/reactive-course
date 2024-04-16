import { Observable, Observer, Subject, Subscription } from "rxjs";

const observer: Observer<any> = {
    next: next => console.log('Next: ', next),
    error: error => console.warn('Error: ', error),
    complete: () => console.log('COMPLETE')
}


const intervalo$ = new Observable<number>(subs => {
    const intrv = setInterval(() => { subs.next(Math.random()) }, 1000)
    return () => {
        clearInterval(intrv);
        console.log('completado');
        
    }
})

const subsject$ = new Subject();

const subsjectSubject$ = intervalo$.subscribe(subsject$);

const subs1 = subsject$.subscribe(console.log);
const subs2 = subsject$.subscribe(console.log);

setTimeout(() => {
    subsject$.next(10);
    subsject$.complete();
    subsjectSubject$.unsubscribe();
}, 3500);