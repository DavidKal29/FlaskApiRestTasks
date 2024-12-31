from flask import Flask,request,jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from dotenv import load_dotenv
from flask_cors import CORS
import os



load_dotenv()

app=Flask(__name__)
CORS(app,resources={r"/*":{"origin":"*"}})

app.config['SQLALCHEMY_DATABASE_URI']=os.getenv('DB_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False

app.app_context().push()
db=SQLAlchemy(app)#conectamos las bases de datos con la app
ma=Marshmallow(app)#conectamos las bases de datos con la app



class Task(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    title=db.Column(db.String(70),unique=True)
    description=db.Column(db.String(140))

    def __init__(self,title,description):
        self.title=title
        self.description=description

with app.app_context():
    db.create_all()#crea todos los objetos que hemos hecho

class TaskSchema(ma.Schema):
    class Meta:
        fields=('id','title','description')

task_schema=TaskSchema()#obtener una tarea
task_schemas=TaskSchema(many=True)#obtener multiples tareas



#RUDA INSERT task -post
@app.route('/tasks', methods=['POST'])
def create_task():
    
   
    
    title=request.json["title"]
    description=request.json["description"]

    newTask=Task(title,description)
    db.session.add(newTask)
    db.session.commit()

    

    
    print('Añadido con exito')
    return task_schema.jsonify(newTask)


###RUTA READ task -get
@app.route('/tasks',methods=['GET'])
def get_tasks():
    ##Nos devuelve todas las tareas
    all_tasks=Task.query.all()
    ##Lista con los datos
    result=task_schemas.dump(all_tasks)
    print('Datos enviandose',result)

    result=jsonify(result)

    return result
    ##Convertimos en json los rsultados del select de la bd por el ORM



##RUTA DE READ ONE task-GET
@app.route('/tasks/<id>', methods=['GET'])
def get_task(id):

    task=Task.query.get(id)
    return task_schema.jsonify(task)


##rutas de update -PUT
@app.route('/tasks/<id>',methods=['PUT'])
def update_task(id):

    task=Task.query.session.get(Task,id)

    title=request.json['title']
    description=request.json['description']

    task.title=title
    task.description=description

    db.session.commit()

    return task_schema.jsonify(task)

@app.route('/tasks/<id>', methods=['DELETE'])
def delete_task(id):
    task=Task.query.session.get(Task,id)

    db.session.delete(task)
    db.session.commit()
    
    return task_schema.jsonify(task)


@app.route('/tasks/delete',methods=['DELETE'])
def delete_all():
    
    db.session.query(Task).delete()
    db.session.commit()

    return jsonify({"message":"All tasks deleted!!!!"})


###ruta de la landing page
@app.route('/',methods=['GET'])
def index():
    return jsonify({"message":"WELCOME TO MY FIRST API REST WITH PYTHON FLASK AND SQLALCHEMY"})

if __name__=='__main__':
    app.run(debug=True)