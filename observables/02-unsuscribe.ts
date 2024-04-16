import { Observable, Observer, Subscription } from "rxjs";

const observer: Observer<any> = {
    next: next => console.log('Next: ', next), 
    error: error => console.warn('Error: ', error), 
    complete: () => console.log('COMPLETE')
}

const intervalo$ = new Observable<number>( subs => {

    let count = 0
    // Crear un contador, 1, 2, 3, 4, 5, .....
    const int = setInterval ( () => {
        // cada segundo
        count++;
        subs.next(count)
    }, 1000)

    return () => {
        clearInterval(int);
        console.log('Intervalo destruido');
    }
})

const sub = intervalo$.subscribe (observer);
const sub2 = intervalo$.subscribe (observer);
const sub3 = intervalo$.subscribe (observer);

const allSubs = new Subscription()
allSubs.add(sub);
allSubs.add(sub2);
allSubs.add(sub3)

setTimeout(() => {
    allSubs.unsubscribe();
    console.log('Completado');
    
}, 6000);


