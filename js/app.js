let DB;

//selectores de la interfaz

const formulario = document.querySelector('form'),
      nombreMascota = document.getElementById('mascota'),
      nombreDueño = document.getElementById('cliente'),
      numTelefono = document.getElementById('telefono'),
      fecha = document.getElementById('fecha'),
      hora = document.getElementById('hora'),
      sintomas = document.getElementById('sintomas'),
      citas = document.getElementById('citas'),
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

        mostrarCitas();
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

              //en index db (se utilizan las transanciones) 
                let transaction = DB.transaction(['citas'],'readwrite');
                let objectStore = transaction.objectStore('citas');
             //console.log(objectStore);
                
             let peticion = objectStore.add(nuevaCita);

             peticion.onsuccess = () => {
                 formulario.reset();
             }

             transaction.oncomplete = () =>{
                alertify.success('Guardado');
                mostrarCitas();
             }
             transaction.onerror =()=>{
                alertify.error('hubo un error,intenta de nuevo');
             }

        }


        function mostrarCitas(){

            //limpiar citas anteriores
            while(citas.firstChild){
                citas.removeChild(citas.firstChild);
            }

            //creamos un objectStore
            let objectStore = DB.transaction('citas').objectStore('citas');
            //retorna una peticion
            objectStore.openCursor().onsuccess = function(e){
                //cursos se va a ubicar en el resgistro indicado para acceder a los datos
                let cursor = e.target.result;

                console.log(cursor);
                if(cursor){
                    let citaHTML = document.createElement('li');
                    citaHTML.setAttribute('data-cita-id',cursor.value.key);
                    citaHTML.classList.add('list-group-item');
                    citaHTML.innerHTML = `
                        <p class=""font-weight-bold>Cita  nº:<span class="font-weight-normal"> ${cursor.value.key}</span> </p>
                        <p class=""font-weight-bold>Dueño :<span class="font-weight-normal">${cursor.value.cliente}</span> </p>
                        <p class=""font-weight-bold>Numero telefonico :<span class="font-weight-normal">${cursor.value.telefono}</span> </p>
                        <p class=""font-weight-bold>Fecha :<span class="font-weight-normal">${cursor.value.fecha}</span> </p>
                        <p class=""font-weight-bold>Hora :<span class="font-weight-normal">${cursor.value.hora}</span> </p>
                        <p class=""font-weight-bold>sintomas :<span class="font-weight-normal">${cursor.value.sintomas}</span></p>
                        
                    `;
                    //boton de borrar
                    const btnBorrar = document.createElement('button');
                    btnBorrar.classList.add('borrar','btn','btn-danger');
                    btnBorrar.innerHTML= '<span aria-hidden="true">x</span>Borrar';
                    btnBorrar.onclick = borrarCitas;
                    citaHTML.appendChild(btnBorrar);

                    //append al padre
                    citas.appendChild(citaHTML);
                    cursor.continue();
                }else{

                    if(!citas.firstChild){

                        //cuando no hay registro mostar mensaje 
                        headingAdministra.textContent = 'Agregar Citas para comenzar';
                        let listado = document.createElement('p');
                        listado.classList.add('text-center');
                        listado.textContent = 'No hay registros';
                        citas.appendChild(listado);
                    }
                    else{
                        headingAdministra.textContent = 'Administra tus citas';
                    }



                    
                }
            }

        }

        function borrarCitas(e){
           let  citaDelete =Number( e.target.parentElement.getAttribute('data-cita-id'));

           //en index db (se utilizan las transanciones) 
           let transaction = DB.transaction(['citas'],'readwrite');
           let objectStore = transaction.objectStore('citas');
            //console.log(objectStore);
           
            //eliminar del indexDB
            let peticion = objectStore.delete(citaDelete);
            //Eliminar del DOM
            transaction.oncomplete =()=>{
                 e.target.parentElement.parentElement.removeChild(e.target.parentElement);

                if(!citas.firstChild){

                    //cuando no hay registro mostar mensaje 
                    headingAdministra.textContent = 'Agregar Citas para comenzar';
                    let listado = document.createElement('p');
                    listado.classList.add('text-center');
                    listado.textContent = 'No hay registros';
                    citas.appendChild(listado);
                }
                else{
                    headingAdministra.textContent = 'Administra tus citas';
                }

            }

        }
      
});

 

