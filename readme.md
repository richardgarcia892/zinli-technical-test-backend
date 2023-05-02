# Prueba tecnica Zinli-backend-api

## About

Esta aplicacion tiene como finalidad funcionar como evaluacion para prueba tecnica de Zinli,
La API esta basada en el framework express de node JS, implementando a su vez typescript para dar cobertura al requisito expuesto en la prueba

Como motor de base de datos se decidio utilizar MongoDB, alojado en un cluster de Mongo Atlas.

## Funcionamiento.

El entry point de la aplicacion es el archivo server.ts, en este se configura todo lo relevante al servidor, se invoca la conexion de bases de datos y se llama al archivo app.ts en el cual se realiza toda la configuracion de la aplicacion de express,

el archivo app.ts hace llamado a un unico router, el cual por su cuenta se encarga de manejar todos los otros, esto con el objetivo de mantener esta seccion del codigo mas limpia y unicamente dedicada a los middlewares propios de Express requerido para el correcto funcionamiento de la aplicacion (tales como helmet, cors, entre otros).

para el Scope del ejercicio, se incluyeron unicamente los controladores y rutas para las funciones:

- Registro de usuario (signup)
- Activacion de cuenta
- Ingreso al sistema (signin)
- Desconexion (signout)
- Solicitud de cambio de contrasena por olvido
- Cambio de contrasena por olvido
- Actualizacion de contrasena
- Consulta de perfil de usuario (usuaro actual)
- Actualizacion de datos de usuario

## Por mejorar:

### Mails:

- Implementar templates HTML para los correos
- Implementar protocolo seguro a los emails
- migrar de sendgrid -> AWS SES

### Validaciones:

- Crear Schemas para verificacion de Headers

### Testing:

- Implementar purebas E2E
- Implementar pruebas unitarias

### General:

- Implementar object mappers para transformar los objetos de forma automatica
- Mejorar el flujo de la aplicacion respecto a los controllers para disminuir redundancia de codigo, ejemplo: Actualmente se verifica en cada middleware subsecuente a - isSignedIn si el objeto user existe dentro de req.

### Configuracion:

- Mejorar la implementacion de los archivos y clases e configuracion

### Registro

- Implementar una libreria de manejo de sesion (Como passport, por ejemplo)
- agregar soporte a Oauth para iniciar sesion con github, google, facebook, etc.

### Seguridad

- Implementar cors apropiadamente
- Configurar helmet
- Configurar base de datos para solo permitir acceso desde ciertas locaciones

## Despliegue

Pendiente por implementar
