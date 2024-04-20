# Curso ReactiveX

* [¿Qué es la programación reactiva?](#qué-es-la-programación-reactiva)
* [¿Qué es ReactiveX?](#que-es-reactive)
* [¿Cuándo usar Rx?](#cuándo-usar-rx)
* [¿Qué es RxJS?](#qué-es-rxjs)
* [Observables](#observables)    
    * [observables.next()](#observablesnext)
    * [observables.error()](#observableserror)
    * [observables.complete()](#observablescomplete)
    * [Subject](#subject)
    * [Cold Observable vs Hot Observable](#cold-observable-vs-hot-observable)
    * [obs.of()](#obsof)
    * [obs.from()](#obsfrom)
    * [obs.fromEvent()](#obsfromevent)
    * [obs.range()](#obsrange)
    * [obs.interval()](#obsinterval)
    * [obs.timer()](#obstimer)
    * [Buenas prácticas con Observables](#buenas-prácticas-con-observables)
* [Observer](#observer)
* [Scheduler](#scheduler)
    * [Tipos de Scheduler](#tipos-de-scheduler)
    * [asyncScheduler](#asyncscheduler)
* [Subscribers](#subscribers)
    * [Tipos de Scheduler](#tipos-de-scheduler)
* [Operators](#operators)  
    * [pipe()](#pipe)
    * [op.map()](#opmap)
    * [op.pluck()](#oppluck)
    * [op.mapTo()](#opmapto)
    * [op.filter()](#opfilter)
    * [op.tap()](#optap)
    * [op.reduce()](#opreduce)
    * [op.scan()](#opscan)


## ¿Qué es la programación reactiva?
Es un paradigma de la programación declarativa funcional relacionada con el tratamiento de flujos de datos (data streams) y la propagación de los cambios.

## ¿Qué es ReactiveX?
ReactiveX es una biblioteca de software creada originalmente por Microsoft que permite que los lenguajes de programación imperativos operen en secuencias de datos sin importar si los datos son sincrónicos o asincrónicos.


## ¿Cuándo usar Rx?
* Al momento de manejar eventos de la interfaz de usuario
* Cuando es necesario notificar sobre cambios de uno o varios objetos
* Comunicación por Sockets
* Cuando necesitamos trabajar con flujos de información **(Streams)**

## ¿Qué es RxJS?
RxJS es la adaptación a JS (JavaScript) del conjunto de herramientas de ReactiveX, está desarrollada para diversos lenguajes como C++ (RxCpp), C# (Rx.NET), o PHP (RxPHP) entre otros.

## Observables
Son la pieza fundamental de las extensiones reactivas. En lugar de manejar los eventos de manera imperativa, los `Observables` ofrecen una forma declarativa de tratar con secuencias de eventos y datos asíncronos. Entre sus características principales tenemos:
* Son la fuente de información.
* Pueden emitir múltiples valores, sólo uno o ninguno.
* Pueden emitir errores.
* Pueden ser finitos o infinitos.
* Pueden ser síncronos o asíncronos.

<img src="img/observable.png" width="auto;"/>

Un observable tiene la capacidad de emitir o no un valor, para instanciar un observable basta con importar la librería e iniciarlo con el método `create` o con `new Observable<tipo_de_dato>()`, en TS en caso de no colocar el tipo de dato, el lenguaje interpretará que es de tipo `any`
```ts
import { Observable } from "rxjs";

// const obs$ = Observable.create();
const obs$ = new Observable<string>();
```
> **Nota**: el método `create` se encuentra deprecated desde la v7 de rxjs y sera eliminado en la v8.

Un método facil de identificar cuando es un observable es que se importa directamente de rxjs `import { ... } from "rxjs";`

### observables.next()
Las notificaciones "Next" son las más importantes, y las más comunes ya que representan los datos que se envían al suscriptor. Las mismas deben ser del tipo de dato indicado en caso de trabajar con un lenguaje de tipado o puede ser nulas.

```ts
import { Observable } from "rxjs";

// const obs$ = Observable.create();
const obs$ = new Observable(subs => {
    subs.next('test');
    subs.next('hola');
});

obs$.subscribe(console.log);
```

### observables.error()
El método `error()` no es más que un controlador para notificar de un error. Un error detiene la ejecución de la instancia observable y cancela la suscripción.

```ts
import { Observable } from "rxjs";
const obs$ = new Observable<string>(subs => {
    // Forzando un error
    const a = undefined;
    a.nombre = 'Fernando'
    console.log('1');
    subs.complete();
});

obs$.subscribe({ 
    next: next => console.log('Next: ', next), 
    error: error => console.warn('Error: ', error), 
    complete: () => console.log('COMPLETE')
});

```
En este ejemplo forzamos un error donde se mostrará por consola el siguiente mensaje

<img src="img/error.png" width="auto;"/>




### observables.complete()
El método `complete()` no es más que un controlador para notifica que la ejecución fue completada.

```ts
import { Observable } from "rxjs";

// const obs$ = Observable.create();
const obs$ = new Observable(subs => {
    subs.next('test');
    subs.next('hola');
    subs.complete();
});

obs$.subscribe(console.log);

```
Una vez colocado aunque se emitan valores los mismos no llegarían a sus subscriptores. En el ejemplo de a continuación los valores test y hola se emite, pero los número 2 y 3 no lo harán

```ts
import { Observable } from "rxjs";

// const obs$ = Observable.create();
const obs$ = new Observable(subs => {
    subs.next('test');
    subs.next('hola');
    subs.complete();
    subs.next('2');
    subs.next('3');
});

obs$.subscribe(console.log);
```

### Subject
Un `Subject` es una especie de puente entre los observables (emisores) y los Observers (suscriptores) de un flujo de datos. Tiene las caracteristicas de:
* Permite el casto múltiple.
* Es un observer
* Tiene las propiedades Next, Error y Complete

Un `Subject` es, en sí mismo, un observable que puede emitir valores, pero también es un objeto que puede ser utilizado para suscribirse a los eventos emitidos. 
```ts
import { Observable, Observer, Subject, Subscription } from "rxjs";

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
```

En este ejemplo nos estámos subscribiendo al observable `intervalo$` y emitimos valores con `subsject$.next(10);`

### Cold Observable vs Hot Observable
Cuando la data es producida por el observable en sí mismo, es considerado un `Cold Observable`. Pero cuando la data es producida fuera del observable es llamado `Hot Observable`

```ts
import { Observable, Observer, Subject, Subscription } from "rxjs";

const intervalo$ = new Observable<number>(subs => {
    const intrv = setInterval(() => { subs.next(Math.random()) }, 1000)
    return () => {clearInterval(intrv)}
})

const subsject$ = new Subject();

intervalo$.subscribe(subsject$);

const subs1 = subsject$.subscribe(console.log);
const subs2 = subsject$.subscribe(console.log);

setTimeout(() => {
    subsject$.next(10);
    subsject$.complete();
}, 3500);
```
La respuesta por consola de este código por consola sería

<img src="img/cold-and-hot-observable.png" width="auto;"/>

Acá podemos apreciar un buen ejemplo del `Hot Observable` ya que logramos insertar información al usando el `subsject$.next(10)` al flujo de datos que el observable `intervalo$` estaba emitiendo.


### obs.of()
El operador `of()` es una función que toma como parámetro una secuencia de elementos y devuelve un observable que emite cada elemento de la secuencia tal cual como se recibió, tiene la particularidad que emite sincrónicamente los argumentos descritos y luego se completa inmediatamente.

<img src="img/obs-of.png" width="auto;"/>

Es importante tomar en consideración que los valores enviamos deben estar separados por comas (,) a fin que detecte que son elementos diferentes. La nomenclatura usada sería `of<tipo-valor>(valor1, valor2, valor3);`
```ts
import { of } from "rxjs";

const obs$ = of(1,2,3,4,5,6);

obs$.subscribe({
    next: next => console.log('Next: ', next),
    error: error => console.warn('Error: ', error),
    complete: () => console.log('Terminamos la secuencia')
})

const obs2$ = of([1,2,3,4,5,6]);

obs2$.subscribe({
    next: next => console.log('Next: ', next),
    error: error => console.warn('Error: ', error),
    complete: () => console.log('Terminamos la secuencia')
})
```
En el anterior ejemplo vemos como `obs$` responde con 6 diferentes elementos númericos mientras que `obs2$` nos responde un solo elemento de tipo array

<img src="img/obs-of-example.png" width="auto;"/>

### obs.from()
El operador `from()` es una función que crea un Observable a partir de una Array, Objeto, Promesa, iterable o un Observable.

<img src="img/observable-from.png" width="auto;"/>

La nomenclatura usada sería `from<tipo-valor>(target, eventName);`.
```ts
import { of, from, Observer } from "rxjs";

const fromObserver: Observer<any> = {
    next: next => console.log('fromObserver Next: ', next), 
    error: error => console.warn('Error: ', error), 
    complete: () => console.log('fromObserver COMPLETE')
}

const source$ = from([1,2,3,4,5]);

source$.subscribe(fromObserver);
```
La respuesta de este código sería

<img src="img/obs-from-example.png" width="auto;"/>

El observable `from` y el `of` generan distintas respuestas al pasarles un argumento como un string
```ts
import { of, from, Observer } from "rxjs";

const fromObserver: Observer<any> = {
    next: next => console.log('fromObserver Next: ', next), 
    error: error => console.warn('Error: ', error), 
    complete: () => console.log('fromObserver COMPLETE')
}

const ofObserver: Observer<any> = {
    next: next => console.log('ofObserver Next: ', next), 
    error: error => console.warn('Error: ', error), 
    complete: () => console.log('ofObserver COMPLETE')
}

const source2$ = from('Fernando');
const source3$ = of('Fernando');

source2$.subscribe(fromObserver);
source3$.subscribe(ofObserver);
```
Por consola veríamos esta respuesta

<img src="img/obs-from-of-example.png" width="auto;"/>

El `from()` también permite trabajar con promesas

```ts
import { of, from, Observer } from "rxjs";

const observer: Observer<any> = {
    next: next => console.log('fromObserver Next: ', next), 
    error: error => console.warn('Error: ', error), 
    complete: () => console.log('fromObserver COMPLETE')
}

const source2$ = from(fetch("https://api.github.com/users/klerith"));

source2$.subscribe( async(res) => {
    const data = await res.json()
    console.log(data);
})

source2$.subscribe(observer)
```
En este caso usamos una petición `fetch` propia de JS para realizar la promesa la cual nos trae la siguiente respuesta

<img src="img/obs-from-example-2.png" width="auto;"/>

El observable `from()`, nos permitirá recorrer iterables similar a un bucle for aunque se diferencia de este ya que en vista que la respuesta es un observable se podra usar distintos Operadores para poder adaptar el response resultante

```ts
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
```



### obs.fromEvent()
El operador `fromEvent()` es una función que crea un Observable que emite eventos de un tipo específico, originados en el *event target* proporcionado. Un *event target* es un objeto con métodos para registrar las funciones de manejo de eventos.

<img src="img/obs-from-event.png" width="auto;"/>

Un ejemplo del uso del `fromEvent` es cuando deseamos escuchar eventos propios del DOM, en este caso escucharemos los eventos del `click` y del `keyup`.
La nomenclatura usada sería `fromEvent<tipo-valor>(target, eventName);`

```ts
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
```

### obs.range()
La función `range()` crea un Observable que emite una secuencia de números dentro de un rango. Por default esta función es sincrona

<img src="img/obs-range.png" width="auto;"/>

La función `range()` posee la siguiente nomenclatura `range(start: number, count?: number, scheduler?: SchedulerLike): Observable<number>`, donde si solo se coloca un valor indicará la cantidad de emisiones iniciando en el `valor 0`.
* **start:** El valor del primer número entero de la secuencia.
* **count:** El número de enteros secuenciales que se generarán.
* **scheduler:** Es un SchedulerLike que se utiliza para programar las emisiones de las notificaciones. Esto puede permitir modificar la función de sincrona a asincrona

```ts
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
```
La respuesta de este ejemplo daría

<img src="img/obs-range-example.png" width="auto;"/>


### obs.interval()
La función `interval()` crea un Observable que emite una secuencia de números incremental, con el intervalo de tiempo entre emisiones que se especifique. Por default esta función es asincrona

<img src="img/obs-interval.png" width="auto;"/>

La función `interval()` posee la siguiente nomenclatura `interval(period: number = 0, scheduler: SchedulerLike = async): Observable<number>`, 

* **period:** El valor por defecto es `0`. El tamaño del intervalo en milisegundos (por defecto) o en la unidad de tiempo determinada por el reloj del planificador.
* **scheduler:** Es un SchedulerLike, el valor por defecto es `async`. El SchedulerLike que se utiliza para planificar la emisión de valores y para proporcionar la noción del "tiempo".

```ts
import { Observer, interval } from "rxjs";

const observer: Observer<number> = {
    next: next => console.log('Next: ', next),
    error: error => console.warn('Error: ', error),
    complete: () => console.log('COMPLETE')
}

const interval$ = interval(1000);

console.log('inicio');
interval$.subscribe(observer)
console.log('fin');
```
La respuesta de este ejemplo daría

<img src="img/obs-interval-example.png" width="auto;"/>


### obs.timer()
La función `timer()` crea un Observable que comienza a emitir una secuencia ascendente de números consecutivos a intervalos, tras un periodo inicial de tiempo. Por default esta función es asincrona

<img src="img/obs-time.png" width="auto;"/>

La función `timer()` posee la siguiente nomenclatura `timer(dueTime: number | Date = 0, periodOrScheduler?: number | SchedulerLike, scheduler?: SchedulerLike): Observable<number>`, 

* **dueTime:** El valor por defecto es `0`. El valor del retraso inicial que esperar antes de emitir el primer valor, especificado como objeto Date o como Integer, en milisegundos.
* **periodOrScheduler:** El valor por defecto es `undefined`. El periodo de tiempo entre emisiones.
* **scheduler:** Es un SchedulerLike, El valor por defecto es `undefined`. EL SchedulerLike que utilizar para planificar las emisiones, proporcionando la noción de 'tiempo'.

```ts
import { Observer, timer } from "rxjs";

const observer: Observer<number> = {
    next: next => console.log('Next: ', next),
    error: error => console.warn('Error: ', error),
    complete: () => console.log('COMPLETE')
}

const timer$ = timer(2000);
const timer2$ = timer(3000, 1000);

const today = new Date();
today.setSeconds(today.getSeconds() + 6)

const timer3$ = timer(today);


console.log('inicio timer$');
timer$.subscribe(observer)
console.log('fin timer$');

console.log('inicio timer2$');
timer2$.subscribe(observer)
console.log('fin timer2$');

console.log('inicio timer3$');
timer3$.subscribe(observer)
console.log('fin timer3$');
```

La respuesta de este ejemplo daría

<img src="img/obs-timer-example.png" width="auto;"/>

Como se puede apreciar en el `timer$` fue completado al pasar 2 segundos, por su parte el `timer2$` empezó a generar intervalos de tiempo a partir de los 3 segundos cada 1 seg, por último el timer3$ realizó su única ejecución a los 6 segundos y completo instantaneamente.





### Buenas prácticas con Observables
* **Nomenclatura de variables:** Es recomendable identificar un `Observable` con una variable la cual lleve al final de la misma un simbolo de dolar, por ejemplo **`clicks$`**.
* **Utiliza tipado fuerte:** Es recomendable especificar el tipo de datos emitidos por el Observable utilizando tipos fuertemente tipados.
* **Evita la creación innecesaria de Observables:** En lugar de crear nuevos Observables para cada operación, intenta encadenar operadores en un solo Observable utilizando tuberías (pipes). 
* **Utiliza el operador `pipe`:** El operador pipe permite encadenar múltiples operadores para transformar, filtrar o combinar los datos emitidos por el Observable.
* **Desuscribe adecuadamente:** Si te suscribes a un Observable, asegúrate de desuscribirte cuando ya no necesites recibir más datos.
* **Evita el uso de `any`:** En la medida de lo posible, evita utilizar el tipo any para los datos emitidos por los Observables.
* **Utiliza operadores de error:** Los Observables proporcionan operadores como `catchError` y `retry` para manejar errores de manera más robusta.
* **Separación de responsabilidades:** Separa las operaciones de los Observables en diferentes funciones o servicios.
* **Documenta tus Observables:** Añade comentarios o documentación que explique la finalidad y el comportamiento de los Observables que estás utilizando.

## Observer
Un `Observer` o `Observador` es aquel que se subscribe a un `Observable`, basicamente es un consumidor de los valores emitidos por un Observable. Los Observadores son simplemente conjuntos de callbacks, una para cada tipo de notificación entregada por el Observable: next, error y complete. El observador reaccionará a cualquier elemento o secuencia de elementos que emita el Observable. A continuación vemos un ejemplo de un objeto Observador clásico:

```ts
const observer = {
  next: (x) => console.log("El Observador ha recibido un valor next: " + x),
  error: (err) => console.error("El Observador ha recibido un error: " + err),
  complete: () =>
    console.log("El Observador ha recibido una notificación de compleción"),
};
```

Para utilizar el Observador, se le provee al `subscribe` de un Observable:
```ts
observable.subscribe(observer);
```
> Nota: *Los Observadores son objetos con tres callbacks, una para cada tipo de notificación que un Observable puede emitir.*

Los Observadores en RxJS pueden ser parciales. Aunque no se proporcione una de las *callbacks*, la ejecución del Observable ocurrirá de forma normal, excepto por el hecho de que algunos tipos de notificaciones se ignorarán, ya que carecen de la callback correspondiente en el Observador.

El ejemplo visto a continuación muestra un Observador sin la callback complete:

```ts
const observer = {
  next: (x) => console.log("El Observador ha recibido un valor next: " + x),
  error: (err) => console.error("El Observador ha recibido un error: " + err),
};
```

Al realizar la suscripción a un Observable, también se pueden proporcionar las callbacks como argumentos, sin tener que estar vinculadas a un objeto Observador. Por ejemplo:

```ts
observable.subscribe((x) =>
  console.log("El Observador ha recibido un valor next: " + x)
);
```

Internamente en observable.subscribe, se creará un objeto Observador utilizando el primer argumento callback como el manejador next. Los tres tipos de callbacks pueden proporcionarse como argumentos:
> Nota: ~~Foma de callbacks actualmente en desuso~~.
```ts
observable.subscribe(
  (x) => console.log("El Observador ha recibido un valor next: " + x),
  (err) => console.error("El Observador ha recibido un error: " + err),
  () => console.log("El Observador ha recibido una notificación de compleción")
);
```


## Scheduler
Un `Scheduler` o `Planificador` controla cuándo comienza una suscripción, y cuándo se envían las notificaciones. Está compuesto por tres componentes:

* **Un Scheduler es una estructura de datos.** Sabe cómo almacenar y poner tareas a la cola basándose en la prioridad u otro criterio.
* **Un Scheduler es un contexto de ejecución.** Denota dónde y cuándo se ejecuta una tarea (ej: inmediatamente, o mediante otro mecanismo de callback tal como setTimeout, process.nextTick o el Animation frame.)
* **Un Scheduler tiene un reloj (virtual).** Este proporciona la noción de "tiempo" mediante un método de acceso now() en el Planificador. Las tareas que se planifican con un Planificador particular se adherirán únicamente a la noción de tiempo proporcionada por su reloj.

> Nota: Un `Scheduler` permite definir en qué contexto de ejecución se enviarán las notificaciones de un Observable a su Observador.

En el ejemplo mostrado a continuación, se parte del ejemplo simple de un Observable que emite los valores 1, 2 y 3 de forma síncrona, y se utiliza el operador `observeOn` para especificar que el Planificador `async` será utilizado para enviar esos valores.

```ts
import { Observable, asyncScheduler } from "rxjs";
import { observeOn } from "rxjs/operators";

const observable = new Observable((observer) => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
}).pipe(observeOn(asyncScheduler));

console.log("Justo antes de subscribe");
observable.subscribe({
  next(x) {
    console.log("Obtenido valor " + x);
  },
  error(err) {
    console.error("Ha ocurrido algo : " + err);
  },
  complete() {
    console.log("Completado");
  },
});
console.log("Justo después de subscribe");
// Salida
/**
    Justo antes de subscribe
    Justo después de subscribe
    Obtenido valor 1
    Obtenido valor 2
    Obtenido valor 3
    Completado
*/
```
Nótese que las notificaciones `Obtenido valor...` se enviaron después de `Justo después de subscribe`. Este comportamiento es distinto al comportamiento por defecto que hemos podido ver hasta ahora. Esto es debido a que `observeOn(asyncScheduler)` introduce un Observador proxy entre `new Observable` y el Observador final. Se pueden renombrar los identificadores para hacer que esta distinción sea obvia, como podemos ver en el siguiente código:

```ts
import { Observable, asyncScheduler } from "rxjs";
import { observeOn } from "rxjs/operators";

const observable = new Observable((proxyObserver) => {
  proxyObserver.next(1);
  proxyObserver.next(2);
  proxyObserver.next(3);
  proxyObserver.complete();
}).pipe(observeOn(asyncScheduler));

const finalObserver = {
  next(x) {
    console.log("Obtenido valor " + x);
  },
  error(err) {
    console.error("Ha ocurrido algo: " + err);
  },
  complete() {
    console.log("Completado");
  },
};

console.log("Justo antes de subscribe");
observable.subscribe(finalObserver);
console.log("Justo después subscribe");
```
El `proxyObserver` se crea en `observeOn(asyncScheduler)`, y su función `next(val)` es aproximadamente la que vemos a continuación:

```ts
const proxyObserver = {
  next(val) {
    asyncScheduler.schedule(
      (x) => finalObserver.next(x),
      0 /* Retardo */,
      val /* Será la x para la función anterior */
    );
  },

  // ...
};
```
El Planificador `async` opera con un `setTimeout` o `setInterval`, aunque el `delay` proporcionado sea cero. Como es habitual en JavaScript, `setTimeout(fn, 0)` ejecuta la función `fn` lo más pronto posible en la siguiente iteración del bucle de eventos. Esto explica por qué `Obtenido valor 1` se envía al `finalObserver` después de que ocurra `Justo después de subscribe.`

El método `schedule()` de un Planificador recibe un argumento `delay`, que se refiere a la cantidad de tiempo relativo al reloj interno propio del Planificador. El reloj del Planificador no tiene por qué tener relación alguna al tiempo de un reloj tradicional. Así es como los operadores temporales como `delay` operan según el tiempo dictaminado por el reloj del Planificador, en lugar de según el tiempo real. Esto es especialmente útil a la hora de hacer tests, ya que puede utilizarse un Planificador de tiempo virtual para falsificar el tiempo real, mientras se ejecutan tareas planificadas de forma síncrona.

### Tipos de Scheduler
El Scheduler `async` es uno de los Scheduler que proporciona RxJS. Cada uno de estos Scheduler se puede crear y retornar mediante las propiedades estáticas del objeto `Scheduler`.

|       Planificador      	|                                                                                                                Función                                                                                                               	|
|:-----------------------:	|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:	|
| null                    	| Si no se proporciona un planificador, las notificaciones se emiten de forma síncrona y recursiva. Se debe utilizar para operaciones de tiempo constante u operaciones recursivas lineales finales.                                   	|
| queueScheduler          	| Planifica en una cola en el **event frame** actual (planificador trampolín.) Se debe utilizar para operaciones de iteración.                                                                                                         	|
| asapScheduler           	| Planifica en la cola de **micro task**, que es la misma cola que se utiliza para las promesas. Básicamente se planifica después de la tarea actual, pero antes de la siguiente tarea. Se debe utilizar para conversiones asíncronas. 	|
| asyncScheduler          	| Planifica tareas con setInterval. Se debe utilizar para operaciones basadas en el tiempo.                                                                                                                                            	|
| animationFrameScheduler 	| Planifica una tarea que ocurrirá justo antes del siguiente repintado del contenido del navegador. Se puede utilizar para crear animaciones más fluidas en el navegador.                                                              	|


### asyncScheduler
La propiedad `asyncScheduler` es un `Scheduler` que permite programar la tarea como si usara `setTimeout (tarea, duración)`, aunque también tiene la capacidad de trabajar como  un `setInterval(tarea, duración)`. El `asyncScheduler` NO crea un observable, sino que crea un `Subscribers` (Suscripción). La nomenclatura del `asyncScheduler.schedule(tarea, tiempo, estado?);`

```ts
import { asyncScheduler } from "rxjs";
setTimeout(() => { }, 1000);

const saludar = () => console.log('Hola Mundo');
const saludar2 = nombre => console.log(`Hola Mundo ${nombre}`);

asyncScheduler.schedule(saludar, 2000)
asyncScheduler.schedule(saludar2, 2000, 'Fernando')

```

Para crear un intervalo es basta con hacer cambiar el estado del `schedule`, en este caso usaremos `this.schedule(state + 1, 1000)` el cual cambiará el estado cada 1 seg. Es importante recordar que el `asyncScheduler` es una suscripción por lo que para cancelar la misma se debe cancelar la misma.


```ts
import { asyncScheduler } from "rxjs";
setInterval(() => { }, 1000)

const sub = asyncScheduler.schedule(function (state) {
    console.log('state', state);    
    this.schedule(state + 1, 1000);
},3000, 0)

setTimeout(() => {
    sub.unsubscribe();
}, 6000);

```



## Subscribers
Un `Subscribers` o `Suscripción` es un objeto que representa un recurso desechable, normalmente la ejecución de un Observable. Las Suscripciones tienen un método importante, `unsubscribe`, que no recibe ningún argumento y se encarga de deshacerse del recurso mantenido por la Suscripción, bien se puede considerar como un método para conectarte a un **[Observable](#observables)**. Entre sus características principales tenemos:

* Se subscriben a un observable, es decir están pendiente de lo que realiza un observable.
* Consumen / observan la data que proviene del observable
* Pueden recibir los errores y eventos del observable
* Desconocen todo lo que se encuentra detrás del observable, es decir, la data puede haber sido previamente filtrada por algún **Operador** pero ellos lo desconocerán.

Para subscribirse a un Observable basta con usar el método `subscribe`

```ts
import { interval } from "rxjs";

const observable = interval(1000);
const subscription = observable.subscribe((x) => console.log(x));
/* 
 Después:
 Esto cancela la ejecución del Observable que 
 comienza al hacer una llamada subscribe con un Observador.
*/
subscription.unsubscribe();
```
> *Una Suscripción contiene una función unsubscribe() para desechar recursos o cancelar ejecuciones de Observables.*

Las suscripciones también pueden unirse, de manera que una llamada a la función unsubscribe() de una suscripción pueda cancelar múltiples suscripciones. Se puede lograr esto al "añadir" una suscripción a otra:

```ts
import { interval } from "rxjs";

const observable1 = interval(400);
const observable2 = interval(300);

const subscription = observable1.subscribe((x) => console.log("first: " + x));
const childSubscription = observable2.subscribe((x) =>
  console.log("second: " + x)
);

subscription.add(childSubscription);

setTimeout(() => {
  // Cancela AMBAS suscripciones: subscription y childSubscription
  subscription.unsubscribe();
}, 1000);

/*
Salida:

second: 0
first: 0
second: 1
first: 1
second: 2
*/
```

Las Suscripciones también tienen un método `remove(otherSubscription)`, para poder deshacernos de las Suscripciones hijas que se añadan.


### PartialObserver
Las subscripciones reciben pueden recibir varios tipos de datos entre los que tenemos los `PartialObserver`, para usarlos basta con importar `Observer` de `rxjs` y colocar los flujos `next`, `error` y `complete`

```ts
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
```

### unsubscribe()
Es una función para liberar recursos o cancelar ejecuciones de un observable, basta con usar el método `unsubscribe()` posterior a la subscripción

```ts
import { Observable, Observer } from "rxjs";

const obs$ = new Observable<string>(subs => {
    subs.next('test');
    subs.next('hola');
    subs.complete();
});

const observer: Observer<any> = {
    next: next => console.log('Next: ', next), 
    error: error => console.warn('Error: ', error), 
    complete: () => console.log('COMPLETE')
}

const sub = obs$.subscribe(observer);
sub.unsubscribe();
```

> **Nota**: Que un recursos cancele la suscripción no implica necesariamente que el observable se detenga.

En caso de tener varias subscripciones y deseamos detenerlas todas en cadena podemos usar el método `add()` para añadir una suscripción a una variable global y posteriormente cancelar dicha suscripción.

```ts
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

```

Este código retornará por consola. Demostrando como después del intervalo de los 6 segundos las suscripciones se detienen


<img src="img/unsuscribe.png" width="auto;"/>





## Operators
Los operadores son funciones que construyen sobre la fundación de los observables para tener una manipulación más sofisticada de las colecciones. Entre sus características principales tenemos:
* Usados para `transformar` Observables, por ejemplo tenemos (map, group, scan...)
* Usados para `filtrar` observables, por ejemplo tenemos (filter, distict, skip, debounce...)
* Se pueden usar para `combinar` observable.
* Se pueden usar para `crear` nuevos observable.

> Nota: Similar a los Observables, para poder identificar si una propiedad es un operador basta ver su importacion ya que ellas vienen de `import {  } from "rxjs/operators"`

### pipe()
La función `pipe()` permite enlazar más de un operador. Los Pipes te permiten combinar múltiples funciones en una sola. La función `pipe()` tiene como argumentos las funciones que quieres que combine y regresa una nueva función que, una vez ejecutada, corre las funciones en una sequencia.

```ts
import { filter, map } from 'rxjs/operators';

const nums = of(1, 2, 3, 4, 5);

// Create a function that accepts an Observable.
const squareOddVals = pipe(
  filter((n: number) => n % 2 !== 0),
  map(n => n * n)
);

// Create an Observable that will run the filter and map functions
const squareOdd = squareOddVals(nums);

// Subscribe to run the combined functions
squareOdd.subscribe(x => console.log(x));
```

La función `pipe()` es también un Observable en RxJS, así que usas esta manera más sencilla para definir la misma operación:

```ts
import { filter, map } from 'rxjs/operators';

const squareOdd = of(1, 2, 3, 4, 5)
  .pipe(
    filter(n => n % 2 !== 0),
    map(n => n * n)
  );

// Subscribe to get values
squareOdd.subscribe(x => console.log(x));
```


### op.map()
El operador `map()` nos permite transformar o extraer lo que emite el observable en algo diferente, manteniendo la estructura del flujo original.

<img src="img/op-map.png" width="auto;"/>

La nomenclatura del operador map() sería `map<E, S>(function(value: T, index: number) => R, thisArg?: any): OperatorFunction<T, R>` donde

* **E:** El tipo de valor de entrada.
* **S:** El tipo de valor de salida.
* **function:** La función que se aplicará a cada valor emitido por el Observable. El cual podra tener un parámetro`index`
* **thisArg:** Un argumento `opcional` para definir el valor del this en la función de proyección. Por defecto es `undefined`.

```ts
import { map } from "rxjs/operators";
import { range } from "rxjs";

const number$ = range(1, 5);

number$.pipe(map<number, number>((number) => number * 2)).subscribe(console.log);
// Salida: 2, 4, 6, 8, 10
```

Es importante que el operador `map()` reciba un return del valor, en el ejemplo anterior al ser función linea el return viene intrinseco, pero al tener al menos 2 lineas se genera una función con `{}` lo que exige que se coloque un return

```ts
range(1, 5).pipe(
    map<number, number>((val, i) => {
        val = i === 0 ? val * 10 : val * 20
        return val;
    })
).subscribe(console.log)
// Salida: 10, 40, 60, 80, 100
```
En caso de no colocarlo y no especificar el tipo de salida que tendrá el operador la salida sera `undefined`

```ts
range(1, 5).pipe(
    map((val, i) => {
        val = i === 0 ? val * 10 : val * 20
    })
).subscribe(console.log)
// Salida: undefined, undefined, undefined, undefined, 1undefined
```
El uso del `map()` es bastante amplio, por ejemplo si recibimos un objeto, podemos especificar que retorne solo el valor que indiquemos

```ts
const keyup$ = fromEvent<KeyboardEvent>( document, 'keyup')

keyup$.pipe(
    map(val => val.key)
).subscribe(console.log)
```


### op.pluck()

El operador `pluck()` nos permite extrae propiedadas de un objeto. ~~Propiedad actualmente en desuso~~. Se reemplaza por el operador `map()`. Ejemplo al final.

<img src="img/op-pluck.png" width="auto;"/>

La nomenclatura del operador pluck() sería `pluck<E,S>(...properties: string[]): OperatorFunction<E,S>` donde

* **E:** El tipo de valor de entrada.
* **S:** El tipo de valor de salida.
* **properties:** Las propiedades anidadas que obtener de cada elemento de la fuente (un objeto).

```ts
import { pluck } from "rxjs/operators";
import { from } from "rxjs";

const language$ = from([
  { name: "Ruby", type: "Multiparadigma" },
  { name: "Haskell", type: "Funcional" },
  { name: "Rust", type: "Multiparadigma" },
]);

language$.pipe(pluck("name")).subscribe(console.log);
// Salida: Ruby, Haskell, Rust
```

También podemos sacarlo con obejtos anidados

```ts
import { pluck } from "rxjs/operators";
import { of } from "rxjs";

const githubUser$ = of(
  { name: "zaldih", stats: { repositories: 23 } },
  { name: "NyaGarcia", stats: { repositories: 30 } },
  { name: "caballerog", stats: { repositories: 89 } },
  { name: "tonivj5", stats: { repositories: 51 } }
);

githubUser$.pipe(pluck("stats", "repositories")).subscribe(console.log);
// Salida: 23, 30, 89, 51
```
El operador `pluck()` ss como `map()`, pero se utiliza para extraer una de las propiedades anidadas de los objetos emitidos. Por ejemplo proyectar cada click a la propiedad tagName del elemento target del click

```ts
import { fromEvent } from "rxjs";
import { pluck } from "rxjs/operators";

const clicks = fromEvent(document, "click");
const tagNames = clicks.pipe(pluck("target", "tagName"));
tagNames.subscribe((x) => console.log(x));
```

> Nota **~~Propiedad en Desuso~~**

Actualmente se puede realizar la misma funcionalidad usando map
```ts
const keyupPluck$ = keyup$.pipe(     
      pluck('target', 'baseURI')    
 );

// Equiparable a

const keyupPluck$ = keyup$.pipe(    
    map(x => x.target['baseURI'])
);
```

### op.mapTo()

El operador `mapTo()` nos permite emitir el mismo valor cada vez que el Observable fuente emite un valor. ~~Propiedad actualmente en desuso~~. Se reemplaza por el operador `map()`. Ejemplo al final.

<img src="img/op-mapTo.png" width="auto;"/>

La nomenclatura del operador mapTo() sería `mapTo<E,S>(value: res): OperatorFunction<E,S>` donde

* **E:** El tipo de valor de entrada.
* **S:** El tipo de valor de salida.
* **value:** El valor al que proyectar cada emisión.

```ts
import { mapTo } from "rxjs/operators";
import { interval } from "rxjs";

const number$ = interval(1000);

number$.pipe(mapTo("La respuesta es 42")).subscribe(console.log);
// Salida: La respuesta es 42, La respuesta es 42, La respuesta es 42, La respuesta es 42...
```
Otro ejemplo es usarlo para emitir "¡Tecla pulsada!" cada vez que se pulse una tecla

```ts
import { mapTo } from "rxjs/operators";
import { fromEvent } from "rxjs";

const key$ = fromEvent(document, "keydown");

key$.pipe(mapTo("¡Tecla pulsada!")).subscribe(console.log);
// Salida: (keyPress) ¡Tecla pulsada!...
```

Otro ejemplo sería proyectar cada click a la cadena 'Hi'

```ts
import { fromEvent } from "rxjs";
import { mapTo } from "rxjs/operators";

const clicks = fromEvent(document, "click");
const greetings = clicks.pipe(mapTo("Hi"));
greetings.subscribe((x) => console.log(x));
```

> Nota **~~Propiedad en Desuso~~**

Actualmente se puede realizar la misma funcionalidad usando map
```ts
const keyup$ = fromEvent<KeyboardEvent>( document, 'keyup')

keyup$.pipe(
    mapTo("key")
).subscribe(console.log)

// Equiparable a

keyup$.pipe(
    map(a => "key")
).subscribe(console.log)
```

### op.filter()
El operador `filter()` filtrar los elementos emitidos por el Observable, emitiendo únicamente aquellos que cumplan una condición. Al igual que un `Array.filter()`, solo emitirá un valor si cumple una condición determinada.

<img src="img/op-filter.png" width="auto;"/>

La nomenclatura del operador sería `filter<E>(predicate: (value: E, index: number) => boolean, thisArg?: any): MonoTypeOperatorFunction<T>` donde

* **E:** El tipo de valor de entrada.
* **S:** El tipo de valor de salida.
* **predicate:** Una función que evalúa cada valor emitido por el Observable fuente. Si retorna true, el valor se emite. Si retorna false, el valor no se emite.
* **thisArg:** Un argumento opcional para determinar el valor del this en la función predicate. por defecto es `undefined`
* **MonoTypeOperatorFunction<T>:** El retorno de un Observable que han cumpliado la condición especificada por la función `predicate`.

```ts
import { filter } from "rxjs/operators";
import { range } from "rxjs";

const number$ = range(1, 10);

number$.pipe(filter((n) => n > 5)).subscribe(console.log);
// Salida: 6, 7, 8, 9, 10
```
Otro ejemplo pudiese ser emitir todas las teclas, excepto la barra espaciadora

```ts
import { filter, map } from "rxjs/operators";
import { fromEvent } from "rxjs";

const key$ = fromEvent<KeyboardEvent>(document, "keydown");

key$
  .pipe(
    map(({ code }) => code),
    filter((code) => code !== "Space")
  )
  .subscribe(console.log);
// Salida: KeyX, KeyO...
```


### op.tap()

### op.reduce()

### op.scan()
