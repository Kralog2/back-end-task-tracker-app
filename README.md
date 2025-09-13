# Backend de App de Tareas

## Requisitos
- Node.js (npm)
- MongoDB local o MongoDB Atlas

## Configuración
Clonar el repositorio
```
git clone https://github.com/Danyaell/back-end-task-tracker-app.git

cd back-end-task-tracker-app

npm install
```

Crear un archivo .env en la raíz del proyecto tomando como base .env.example

```
PORT=4000
CORS_ORIGIN=http://localhost:3000
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=are_the_engineers_who_practice_code_vibing_truly_engineers?_dont_think_so
JWT_EXPIRES_IN=7d
```

Iniciar el servidor en dev (local):
npm run dev

