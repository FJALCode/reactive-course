import { fromEvent, range } from "rxjs";
import { map, mapTo, pluck  } from "rxjs/operators";

// const range = range(1,5)
range(1, 5).pipe(
    map((val, i) => {
        val = i === 0 ? val * 10 : val * 20
        return val;
    })
).subscribe(console.log)


const keyup$ = fromEvent<KeyboardEvent>( document, 'keyup')


keyup$.pipe(
    map(val => val.key)
).subscribe(console.log)


keyup$.pipe(
    mapTo("key")
).subscribe(console.log)