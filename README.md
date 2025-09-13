# Backend de App de Tareas

## Requisitos
- Node.js v18+
- MongoDB local o MongoDB Atlas

## Configuración
1. Clona el repo
2. Copia `.env.example` a `.env` y ajusta valores:

PORT=4000
CORS_ORIGIN=http://localhost:3000
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=un_secret_seguro

3. Instala dependencias:
npm install


4. Inicia el servidor:
npm run dev

