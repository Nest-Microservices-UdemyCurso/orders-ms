# Orders Microservices 

1. Levantar base de datos posgress
```
docker compose up -d
```

2. Instalar prisma `npm install prisma --save-dev`

3. Ejecutar prisma `npx prisma` 

4. Inicializar prisma `npx prisma init` 

5. Le das el poder a prisma para interactuar con las bases de datos `npm install @prisma/client`

5. Crear tus esquemas de DDBB en schema.prisma y luego ejecutar `npx prisma migrate dev --name init` 