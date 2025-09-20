# Backend API

Esta es una API de backend para un sistema de gestión de citas médicas.

## Requisitos Previos

*   [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
*   SQL Server

## Configuración

1.  **Clonar el repositorio**

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <NOMBRE_DEL_DIRECTORIO>
    ```

2.  **Crear archivo `.env`**

    Cree un archivo llamado `.env` en la raíz del proyecto (`Backend/`) y agregue las siguientes variables de entorno:

    ```
    DefaultConnection="Server=.;Database=HospitalDb;Trusted_Connection=True;TrustServerCertificate=True;"
    Jwt__Key="ThisIsASecretKeyAndShouldBeLongEnough"
    Jwt__Issuer="your-issuer"
    Jwt__Audience="your-audience"
    ```

3.  **Ejecutar la aplicación**

    ```bash
    dotnet run
    ```

    La API estará disponible en `https://localhost:7191` (o un puerto similar).

## Modelos

*   **Usuario**: Representa a un usuario del sistema (Administrador o Doctor).
*   **Paciente**: Representa a un paciente.
*   **Doctor**: Representa a un doctor.
*   **Cita**: Representa una cita médica.

## Autorización

La API utiliza JWT para la autenticación y autorización.

*   **Roles**:
    *   `Administrador`: Tiene acceso a todos los endpoints.
    *   `Doctor`: Tiene acceso a la información de los pacientes y a la gestión de sus propias citas.

*   **Endpoints Protegidos**:
    *   Todos los endpoints, excepto `/api/Auth/login`, requieren un token de autenticación.
    *   Algunos endpoints requieren un rol específico (`Administrador` o `Doctor`).

## Endpoints

### Autenticación

#### Iniciar Sesión

*   **POST** `/api/Auth/login`

    **Body:**

    ```json
    {
        "username": "admin",
        "password": "admin123"
    }
    ```

    **Ejemplo con `curl`:**

    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"username": "admin", "password": "admin123"}' https://localhost:7191/api/Auth/login
    ```

### Pacientes

*   **GET** `/api/Pacientes`

    *Requiere token de autenticación (rol "Administrador" o "Doctor").*

    **Ejemplo con `curl`:**

    ```bash
    curl -X GET -H "Authorization: Bearer <TOKEN>" https://localhost:7191/api/Pacientes
    ```

*   **POST** `/api/Pacientes`

    *Requiere token de autenticación (rol "Administrador").*

    **Body:**

    ```json
    {
        "nombre": "Nuevo",
        "apellido": "Paciente",
        "fecha_nacimiento": "2000-01-01T00:00:00",
        "telefono": "123456789"
    }
    ```

    **Ejemplo con `curl`:**

    ```bash
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"nombre": "Nuevo", "apellido": "Paciente", "fecha_nacimiento": "2000-01-01T00:00:00", "telefono": "123456789"}' https://localhost:7191/api/Pacientes
    ```

### Doctores

*   **GET** `/api/Doctores`

    *Requiere token de autenticación (rol "Administrador").*

    **Ejemplo con `curl`:**

    ```bash
    curl -X GET -H "Authorization: Bearer <TOKEN>" https://localhost:7191/api/Doctores
    ```

### Citas

*   **GET** `/api/Citas`

    *Requiere token de autenticación.*

    **Ejemplo con `curl`:**

    ```bash
    curl -X GET -H "Authorization: Bearer <TOKEN>" https://localhost:7191/api/Citas
    ```

### Usuarios

*   **GET** `/api/Usuarios`

    *Requiere token de autenticación (rol "Administrador").*

    **Ejemplo con `curl`:**

    ```bash
    curl -X GET -H "Authorization: Bearer <TOKEN>" https://localhost:7191/api/Usuarios
    ```

## Flujo de Prueba en Postman

A continuación se muestra un flujo de ejemplo para probar la API en Postman.

### 1. Iniciar Sesión como Administrador

Obtenga un token de autenticación para el usuario administrador.

*   **POST** `/api/Auth/login`

    **Body:**

    ```json
    {
        "username": "admin",
        "password": "admin123"
    }
    ```

    **Guarde el token de la respuesta para los siguientes pasos.**

### 2. Crear un Usuario para el Doctor

*   **POST** `/api/Usuarios`

    **Headers:**

    *   `Authorization`: `Bearer <TOKEN_ADMIN>`

    **Body:**

    ```json
    {
        "nombre_usuario": "doctor1",
        "contrasena_hash": "doctor123",
        "rol": "Doctor",
        "activo": true
    }
    ```

    **Guarde el `usuario_id` de la respuesta.**

### 3. Crear el Doctor

*   **POST** `/api/Doctores`

    **Headers:**

    *   `Authorization`: `Bearer <TOKEN_ADMIN>`

    **Body:**

    ```json
    {
        "usuario_id": <ID_USUARIO_DOCTOR>,
        "nombre": "Nombre Doctor",
        "apellido": "Apellido Doctor",
        "especialidad": "Cardiología",
        "telefono": "987654321"
    }
    ```

    **Guarde el `doctor_id` de la respuesta.**

### 4. Crear un Paciente

*   **POST** `/api/Pacientes`

    **Headers:**

    *   `Authorization`: `Bearer <TOKEN_ADMIN>`

    **Body:**

    ```json
    {
        "nombre": "Nombre Paciente",
        "apellido": "Apellido Paciente",
        "fecha_nacimiento": "1990-05-15T00:00:00",
        "telefono": "112233445"
    }
    ```

    **Guarde el `paciente_id` de la respuesta.**

### 5. Crear una Cita

*   **POST** `/api/Citas`

    **Headers:**

    *   `Authorization`: `Bearer <TOKEN_ADMIN>`

    **Body:**

    ```json
    {
        "paciente_id": <ID_PACIENTE>,
        "doctor_id": <ID_DOCTOR>,
        "fecha_hora_cita": "2025-10-01T10:00:00",
        "motivo_consulta": "Chequeo de rutina",
        "estado": "Programada"
    }
    ```
