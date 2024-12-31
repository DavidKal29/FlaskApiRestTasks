// Obtenemos los datos del DOM
let tareas=document.getElementById('tareas')

let enviar=document.getElementById('enviar')
let mostrar=document.getElementById('mostrar')

let get_uno=document.getElementById('get_uno')
let put_uno=document.getElementById('put_uno')
let borrar_uno=document.getElementById('borrar_uno')

let borrar_todos=document.getElementById('borrar_todos')

let displayData=(data)=>{
    comprobarData=false//Variable que validará si se puede recorrer el array con las tareas o la tarea
    tareas.innerHTML='' 
    if (Array.isArray(data) ) {//Comprueba si es un array(si son varias tareas)
        if (data.length==0) {//Comprueba si no hay tareas
            tareas.innerHTML='<h1>Actualmente no tienes tareas</h1>'
        }else{
            comprobarData=true
        }
    }else{
        if (!data.id) {//Comprueba si el id está asociado a alguna tarea
            tareas.innerHTML='<h1>Has seleccionado una tarea que no existe</h1>'
        }else{
            data=[data]//si la tarea existe, mete en un array la tarea para hacerla mas manejable
            comprobarData=true
        }
    }

    if (comprobarData) {//Si ls variable es true, creamos en el div tareas tres columnas para cada dato de la tarea
        tareas.innerHTML=`
            <div id="title_div"><span class="tareas_heads">Título</span></div>
            <div id="description_div"><span class="tareas_heads">Descripción</span></div>
            <div id="id_div"><span class="tareas_heads">Identificador</span></div>
        `
        //Obtenemos las columnas del div tareas
        let title_div=document.getElementById('title_div')
        let description_div=document.getElementById('description_div')
        let id_div=document.getElementById('id_div')

        //Recorremos todas las tareas y metemos cada dato en su respectiva columna
        data.forEach( tarea => {
            title_div.innerHTML+=`<span class="title">${tarea.title}</span>`
            description_div.innerHTML+=`<span class="description">${tarea.description}</span>`
            id_div.innerHTML+=`<span class="id">${tarea.id}</span>`
        });
    }


}

//Función para obtener una tarea por su ID si se proporciona, o todas las tareas si el ID es 0
let getTasks=async(id)=>{
    let endpoint='http://localhost:5000/tasks'//creamos el endpoint
    if (id>0) {//si el id fuera 0, queremos todas las tareas, sino, obtenemos solo la tarea específica
        endpoint+=`/${id}`//añadimos al endpoint el id
    }

    //Hacemos la peticion fetch
    let tarea=await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    
    tarea=await tarea.json()

    return tarea
}



//Al pulsar el boton enviar se enviarán los datos introducidos en los inputs
enviar.addEventListener('click',()=>{
    //Obtenemos los valores de los inputs
    let nombre=document.getElementById('nombre').value.trim()
    let descripcion=document.getElementById('descripcion').value.trim()

    if (nombre=='' || descripcion=='') {//Comprobamos que no esten vacios
        Swal.fire({
            icon: "error",
            title: "Error de Datos",
            text: "Asegurate de rellenar ambos huecos",
            footer: '<a href="#">Why do I have this issue?</a>'
          });  
    }else{
        if (nombre.length>20) {//Comprobamos que el titulo no sea muy largo
            Swal.fire({
                icon: "error",
                title: "Error de Datos",
                text: "El titulo es demasiado largo",
                footer: '<a href="#">Why do I have this issue?</a>'
              });  
        }else if (descripcion.length>50) {//Comprobamos que la desc no sea muy larga
            Swal.fire({
                icon: "error",
                title: "Error de Datos",
                text: "La descripción es demasiado larga",
                footer: '<a href="#">Why do I have this issue?</a>'
              });  
        }else{//Si todo ha salido bien creamos un objeto con los valores de los inputs
            let data={
                title:nombre,
                description:descripcion
            }
        
            fetch('http://127.0.0.1:5000/tasks',{//Hacemos el fetch correspondiente para añadir la nueva tarea
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(data)
            })
             .then(response => response.json())
             .then(data => {//Si todo salió bien, mostramos un mensaje de éxito
                Swal.fire({
                    title: `Tarea "${data.title}" añadida con éxito`,
                    icon: "success",
                    draggable: true
                  });
             })
             .catch(error => {//Si se envió una tarea que ya existe, enviamos el mensaje de error
                Swal.fire({
                    icon: "error",
                    title: "Error de Datos",
                    text: "La tarea ya existe en la base de datos",
                    footer: '<a href="#">Why do I have this issue?</a>'
                  });  
             }); 
        }
    } 
})


//Se mostrarán todas las tareas en un div 
mostrar.addEventListener('click',()=>{
    fetch('http://localhost:5000/tasks', {//hacemos el fetch correspondiente para mostrar todas las tareas
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => displayData(data))//si todo salio bien, pintamos los datos en el div tareas
        .catch(error => console.error('Error:', error));//sino, por consola saldrá el error
})


//Al pulsar este boton, se obtendrá una tarea y se pintará en un div
get_uno.addEventListener('click',()=>{
    let id=document.getElementById('id').value//obtenemos el id del input

    if (id=='') {//Comprobamos que el id no sea un campo vacio
        Swal.fire({
            icon: "error",
            title: "Error de Datos",
            text: "Introduce algún id para poder manejar la tarea asociada a este",
            footer: '<a href="#">Why do I have this issue?</a>'
          });  
    }else{
        fetch(`http://localhost:5000/tasks/${id}`, {//si el id es valido, hacemos el fetch correspondiente para obtener la tarea
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(response => response.json())
            .then(data => displayData(data))//si todo salio bien, pintamos los datos en el div tareas
            .catch(error => console.error('Error:', error));
    }
       
})


//Se actualizará una tarea a través del id y los inputs 
put_uno.addEventListener('click',async()=>{
    //obtenemos todos los datos de los inputs que necesitamos para acutalizar
    let nombre=document.getElementById('nombre_nuevo').value.trim()
    let descripcion=document.getElementById('descripcion_nueva').value.trim()
    let id=document.getElementById('id').value

    if (nombre=='' || descripcion=='' || id=='') {//Verificamos que los tres datos, no sean vacios
        Swal.fire({
            icon: "error",
            title: "Error de Datos",
            text: "Asegurate de rellenar todos los huecos",
            footer: '<a href="#">Why do I have this issue?</a>'
          });  
    }else{//SI todo salió bien
        let tarea=await getTasks(id)//Queremos obtener la tarea, por lo que la obtenemos con la funcion
        console.log(tarea);
        
        if (nombre.length>20) {//Comprobamos si el nombre es demasiado largo
            Swal.fire({
                icon: "error",
                title: "Error de Datos",
                text: "El titulo es demasiado largo",
                footer: '<a href="#">Why do I have this issue?</a>'
              });  
        }else if (descripcion.length>50) {//Comprobamos si la desc es demasiada larga
            Swal.fire({
                icon: "error",
                title: "Error de Datos",
                text: "La descripción es demasiado larga",
                footer: '<a href="#">Why do I have this issue?</a>'
              });  
        }else if(nombre==tarea.title || descripcion==tarea.description){//Comprobamos que los nuevos datos son distintos a los originales
            Swal.fire({
                icon: "error",
                title: "Error de Datos",
                text: "El nuevo titulo y la nueva descripción, no deben ser iguales a los originales",
                footer: '<a href="#">Why do I have this issue?</a>'
              });
        }else{//Si todo salió bien, creamos el objeto con los datos
            let data={
                title:nombre,
                description:descripcion
            }
            
            fetch(`http://127.0.0.1:5000/tasks/${id}`,{//Hacemos el fetch correspondiente para actualizar la tarea
                method:'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(data)
            })
             .then(response => response.json())
             .then(data => {//Mostramos un mensaje de éxito si todo salio correctamente
                Swal.fire({
                    title: `Tarea "${data.title}" actualizada con éxito`,
                    icon: "success",
                    draggable: true
                  });
             })
             .catch(error => {//Si salio algo mal, mostramos un mensaje con las posibles causas
                Swal.fire({
                    icon: "error",
                    title: "Error de Datos",
                    text: "Asegurate de que el id figure en la base de datos y que el titulo no sea igual a otra tarea ya existente",
                    footer: '<a href="#">Why do I have this issue?</a>'
                  });  
             });
            
        }
    }
    
})

//Borrará la tarea a través del id
borrar_uno.addEventListener('click',()=>{
    let id=document.getElementById('id').value//obtenemos el id del input
    if (id=='') {//Comprobamos que el campo id no esté vacio
        Swal.fire({
            icon: "error",
            title: "Error de Datos",
            text: "Introduce algún id para poder manejar la tarea asociada a este",
            footer: '<a href="#">Why do I have this issue?</a>'
          });  
    }else{
        fetch(`http://localhost:5000/tasks/${id}`, {//hacemos el fetch correspondiente para borrar la tarea
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(response => response.json())
            .then(data => {//Si todo salio bien, mostramos el mensaje de exito
                Swal.fire({
                    title: `Tarea "${data.title}" borrada con éxito`,
                    icon: "success",
                    draggable: true
                  });
            })
            .catch(error => {//Si algo salio mal, mostramos el mensaje de error con la causa
                Swal.fire({
                    icon: "error",
                    title: "Error de Datos",
                    text: "Asegurate de que el id figure en la base de datos",
                    footer: '<a href="#">Why do I have this issue?</a>'
                  });  
            });
    }
    
    
})

//Borrará todas las tareas siempre que existan
borrar_todos.addEventListener('click',async()=>{
    let tareas=await getTasks(0)//Queremos obtener todas las tareas, por lo que en la funcion ponemos 0 en el id
    console.log(tareas);
    
    if (tareas.length==0) {//Si no hay tareas, mostramos el mensaje de error, que indica que no hay tareas para borrar
        Swal.fire({
            icon: "error",
            title: "Error de Datos",
            text: "No hay nada que borrar, no tienes tareas",
            footer: '<a href="#">Why do I have this issue?</a>'
          });  
    }else{//Si hay tareas, hacemos el fetch correspondiente para borrar todas las tareas 
        fetch(`http://localhost:5000/tasks/delete`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(response => response.json())
            .then(data => {//Si salio bien el borrado, mostramos el exito
                Swal.fire({
                    title: `Tareas borradas con éxito`,
                    icon: "success",
                    draggable: true
                  });
            })
            .catch(error => console.error('Error:', error));//Sino, mostramos el error
    }
})