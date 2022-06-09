import fs from 'fs';


const maches = fs.readFileSync('time_series_covid19_deaths_US.csv',{
    encoding: 'utf-8'
}).split('\n').map((row: string):string [] =>{
   return row.split(','); 
});

let listaProv = new Array();
var listaDatos = [];

let auxProv = maches[0][6];

// sacar  las provincias
for (let i = 1; i < maches.length; i++) {

    if(maches[i][6] != auxProv){

        auxProv = maches[i][6] 
        listaProv.push(maches[i][6]);
    }
    
    
}
let sumAcumProv=0;
let sumAcumPoblacion=0;

let estadosAcum = new Array();
let dif =0;
let  auxDif =0;

let fecha = maches[0][Object.keys(maches[0]).length-1];

for (let estado of listaProv){

    for (let i = 1; i < maches.length; i++) {
        // sumar las muertes por provincia
        let cantDatos = Object.keys(maches[i]).length;

        
        if(maches[i][6] == estado){
            
            // suma de muertes por estado
            var val:number = +maches[i][cantDatos-1];
            if(val>0){
                sumAcumProv += val;
            }

            // suma de la poblacion por estado 

            // en caso de que existan espacios vacios se corre la columna por medio de la diferencia
            if(cantDatos > auxDif){
                auxDif = cantDatos;
            }else{
                dif = auxDif-cantDatos;
                if(auxDif-cantDatos == 0) dif=0; // en caso de no haber diferencia 
            }
            

            var pobla:number = +maches[i][13-dif];
            
            if(pobla>0){
                sumAcumPoblacion += pobla;
            }


            
        }
        
        
    }

    estadosAcum.push({estado: estado,poblacion:sumAcumPoblacion, acumulado: sumAcumProv});
    sumAcumProv = 0;
    sumAcumPoblacion = 0; 



}


// mostrar las respuestas

let max = 0;
let posMax = 0;
let posMin =0;
let posPorcen =0;
let min =0;

for(let i = 0 ; i < estadosAcum.length ; i++) {

    if(estadosAcum[i].acumulado > max) {
        max = estadosAcum[i].acumulado;
        posMax = i;
    }

    //console.log(estadosAcum);
 
}

// calcular el estado con menor muertes
min = max;

for(let i = 0 ; i < estadosAcum.length ; i++) {

    
    if(estadosAcum[i].acumulado < min) {
        min = estadosAcum[i].acumulado;
        posMin = i;
    }
    
}



    // 1. Estado con mayor acumulado a la fecha

    console.log('');
    console.log('Reporte de casos hasta la fecha '+ fecha);
    console.log('');
    console.log('1 Estado con mayor muertes : ' 
                + estadosAcum[posMax].estado 
                + ' con '
                + estadosAcum[posMax].acumulado
                + ' muertes');

    // 2. Estado con menor acumulado a la fecha

    console.log('');
    console.log('2 Estado con menor muertes : ' 
                + estadosAcum[posMin].estado 
                + ' con '
                + estadosAcum[posMin].acumulado
                + ' muertes');
    // 3. El porcentaje de muertes vs el total de población por estado

    let porcentaje=0;

    let i =0;

    console.log('');
    console.log('3');
    console.log('% Muertes  |  Población');
    for(let item of estadosAcum) {
        if(item.acumulado < item.poblacion){
            if(item.acumulado > 0){
                console.log('    ' 
                        + ((item.acumulado * 100)/ item.poblacion).toFixed(2)
                        + '%  |  '
                        + item.poblacion );

                        let porc :number = (item.acumulado * 100)/ item.poblacion;

                        if(porc > porcentaje){

                            porcentaje = porc;
                            posPorcen = i;
                        }
                }
                if(item.acumulado == 0)console.log('    0.00%  |  ' + item.poblacion);
            }
               i++;
        }


    

    // 4. Cual fue el estado más afectado (explicar por qué)
    console.log('');
    console.log('4 Estado más afectado : ' 
                + estadosAcum[posPorcen].estado 
                + ' ya que tuvo  '
                + porcentaje.toFixed(2)
                + '%  de muertes con respecto a su población de '
                + estadosAcum[posPorcen].poblacion );