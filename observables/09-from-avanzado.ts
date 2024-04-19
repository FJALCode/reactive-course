import { of, from, Observer } from "rxjs";

const observer: Observer<any> = {
    next: next => console.log('fromObserver Next: ', next),
    error: error => console.warn('Error: ', error),
    complete: () => console.log('fromObserver COMPLETE')
}

const miGenerador = function* () {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
}

const miIterable = miGenerador();

for (let id of miIterable) {
    console.log(id);
}

from(miIterable).subscribe(observer);