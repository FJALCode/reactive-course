import { Observable, Observer } from "rxjs";

const obs$ = new Observable<string>(subs => {
    subs.next('test');
    subs.next('hola');

    // Forzando un error
    // const a = undefined;
    // a.nombre = 'Fernando'
    subs.complete();
});

const observer: Observer<any> = {
    next: next => console.log('Next: ', next), 
    error: error => console.warn('Error: ', error), 
    complete: () => console.log('COMPLETE')
}

obs$.subscribe(observer);

// const obs$ = Observable.create();
const obs2$ = new Observable(subs => {
    subs.next('test');
    subs.next('hola');
    subs.complete();
    subs.next('2');
    subs.next('3');
});

obs2$.subscribe(res => console.log(res));

