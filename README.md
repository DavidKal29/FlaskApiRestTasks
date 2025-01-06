# FlaskApiRestTasks
Este es un proyecto que implementa una aplicación de gestión de tareas utilizando Flask para el backend y JavaScript/HTML para el frontend. La aplicación permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre tareas.

# Tecnologías utilizadas
# Backend
    
Python: Concretamente usamos el framework flask, junto a librerias como flask-sqlalchemy o flask-marshmallow para la gestión de bases de datos, flask-cors para poder mandar peticiones http entre el frontend y backend, dotenv para obtener las variables de entorno.

Mysql: Base de datos utlizada para almacenar las tareas.

# Frontend
    
HTML: Para crear la interfaz, con los inputs, botones y secciones.

CSS, SASS: Para decorar con colorines y estilos la interfaz, para que se vea estética.

JavaScript: Para hacer las peticiones http al backend, por medio de fetch, además de pintar o eliminar los datos en la interfaz al pulsar los distintos botones.

SweetAlert2: Librería para mostrar alertas interactivas de manera sencilla.

# Características principales
 
 Enviar tarea: Permite agregar tareas con un título y una descripción.
 
 Mostrar todas las tareas: Recupera y muestra todas las tareas almacenadas.
 
 Mostrar tarea individual: Permite visualizar una tarea específica utilizando su ID.
 
 Actualizar tarea: Permite actualizar el título y la descripción de una tarea existente.
 
 Eliminar tarea: Elimina una tarea específica por su ID.
 
 Eliminar todas las tareas: Elimina todas las tareas de la base de datos.



Para ejecutar este proyecto, necesitas:
- **Python 3.x**
- **MySQL** 
- Librerías de Python:
  - `flask`
  - `python-dotenv`
  - `flask-sqlalchemy`
  - `flask-marshmallow`
  - `flask-cors`
  - `python-mysql-connector`

---

## Instalación

1. **Clona el repositorio**  
   Ejecuta el siguiente comando en tu terminal:
   ```bash
   git clone git@github.com:DavidKal29/FlaskApiRestTasks.git
   cd FlaskApiRestTask

2. **Crea un entorno virtual** (opcional pero recomendado):
   ```bash
   python -m venv env
   source env/bin/activate    # Linux/Mac
   env\Scripts\activate       # Windows

3. **Instala las dependencias** 
   ```bash
   pip install -r requeriments.txt

4. **MYSQL** 
    crea una base de datos con el nombre flaskmysql


5. **Configura las variables de entorno** 
   Crea un archivo .env y pon en él lo siguiente:
   ```env
   DB_URI=mysql+mysqlconnector://user:password@localhost/flaskmysql

6. **Ejectua la aplicacion** 
   ```bash
    python app.py

7. **Abre el navegador** 
   Ve a http://127.0.0.1:5000 para acceder a la aplicación.