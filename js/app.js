let DB;

//selectores de la interfaz

const formulario = document.querySelector('form'),
      nombreMascota = document.getElementById('mascota'),
      nombreDueño = document.getElementById('cliente'),
      numTelefono = document.getElementById('telefono'),
      fecha = document.getElementById('fecha'),
      hora = document.getElementById('hora'),
      sintomas = document.getElementById('sintomas'),
      listadoCitas = document.getElementById('citas'),
      headingAdministra = document.getElementById('administra');
//esperar a que se inicie el evento del dom

document.addEventListener('DOMContentLoaded',() =>{ 
    
    //crear la base de datos
    let creaDB = window.indexedDB.open('citas',1);
    //si hay un error enviarlo a la consola
    creaDB.onerror = function(){console.log('hubo un error en la conexion')};
    //conexion correcta
    creaDB.onsuccess = function() {
        //console.log('conexion correcta')
        DB = creaDB.result;
        //console.log(DB);
    };

    //este metodo solo corre una vez (crear schema de indexDB)

    creaDB.onupgradeneeded = function(e){
        //console.log('solo una vez');
        //agregar campos de el schea de index DB
        let db = e.target.result;
        //definir el objet store  , toma 2 parametros el nombre de la BD y las opciones
        //keyPath => es el indice de la BD
        let objetStore = db.createObjectStore('citas',{
            keyPath: 'key',
            autoIncrement:true
        })
        //crear indices y campos de la BD , createIndex: 3 parametros , nombre ,keypath y opciones
        objetStore.createIndex('mascota','mascota',{unique:false});
        objetStore.createIndex('cliente','cliente',{unique:true});
        objetStore.createIndex('telefono','telefono',{unique:false});
        objetStore.createIndex('fecha','fecha',{unique:false});
        objetStore.createIndex('hora','hora',{unique:false});
        objetStore.createIndex('sintomas','sintomas',{unique:true});

    }

        //evento cuando presionan boton enviar en formulario
        formulario.addEventListener('submit', agregarDatos);

        function agregarDatos(e){
            
            e.preventDefault();
            //crear nuevo objeto
            const nuevaCita = {
                mascota: nombreMascota.value,
                cliente: nombreDueño.value,
                telefono: telefono.value,
                fecha: fecha.value,
                hora: hora.value,
                sintomas: sintomas.value
            }
            //console.log(nuevaCita);

              //en index db se utilizan las transanciones 
                let transaction = DB.transaction(['citas'],'readwrite');
                let objectStore = transaction.objectStore('citas');
             //console.log(objectStore);
                
             let peticion = objectStore.add(nuevaCita);

             peticion.onsuccess = () => {
                 formulario.reset();
             }

             transaction.oncomplete = () =>{
                alertify.success('Guardado')
             }
             transaction.onerror =()=>{
                alertify.error('hubo un error,intenta de nuevo');
             }

        }

      
});

 

