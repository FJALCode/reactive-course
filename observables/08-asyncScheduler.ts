import { asyncScheduler } from "rxjs";
setTimeout(() => { }, 1000);
setInterval(() => { }, 1000)

const saludar = () => console.log('Hola Mundo');
const saludar2 = nombre => console.log(`Hola Mundo ${nombre}`);

asyncScheduler.schedule(saludar, 2000)
asyncScheduler.schedule(saludar2, 2000, 'Fernando')


const schedu = asyncScheduler.schedule(function (state) {
    console.log('state', state);    
    this.schedule(state + 1, 1000);
},3000, 0)

setTimeout(() => {
    schedu.unsubscribe();
}, 6000);
