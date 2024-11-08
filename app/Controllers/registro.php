<?php
header('Access-Control-Allow-Origin: https://gentle-arithmetic-98eb61.netlify.app');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar la solicitud OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('HTTP/1.1 200 OK');
    exit();
}

include_once '../config/database.php';
include_once '../Models/Usuario.php';

$database = new Database();
$db = $database->getConnection();
$usuario = new Usuario($db);

// Obtener los datos enviados
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validar datos requeridos
    if(
        !empty($_POST['nombre']) &&
        !empty($_POST['apellido']) &&
        !empty($_POST['email']) &&
        !empty($_POST['password'])
    ) {
        // Asignar valores
        $usuario->nombre = htmlspecialchars(strip_tags($_POST['nombre']));
        $usuario->apellido = htmlspecialchars(strip_tags($_POST['apellido']));
        $usuario->email = htmlspecialchars(strip_tags($_POST['email']));
        
        // Guardar la contraseña sin hashear para el login posterior
        $password_original = $_POST['password'];
        // Hashear la contraseña para el almacenamiento
        $usuario->password = password_hash($password_original, PASSWORD_DEFAULT);
        
        $usuario->direccion = !empty($_POST['direccion']) ? htmlspecialchars(strip_tags($_POST['direccion'])) : "";
        $usuario->telefono = !empty($_POST['telefono']) ? htmlspecialchars(strip_tags($_POST['telefono'])) : "";

        try {
            if($usuario->crear()) {
                // Logging para debug
                error_log("Usuario creado exitosamente. Email: " . $usuario->email);
                
                // Devolver directamente los datos del usuario
                echo json_encode(array(
                    "status" => "success",
                    "message" => "Usuario creado exitosamente",
                    "data" => array(
                        "id" => $usuario->id,
                        "nombre" => $usuario->nombre,
                        "email" => $usuario->email
                    )
                ));
                
            } else {
                throw new Exception("No se pudo crear el usuario");
            }
        } catch(Exception $e) {
            error_log("Error completo en registro.php: " . $e->getMessage());
            echo json_encode(array(
                "status" => "error",
                "message" => $e->getMessage()
            ));
        }
    } else {
        echo json_encode(array(
            "status" => "error",
            "message" => "No se pueden dejar campos vacíos"
        ));
    }
} else {
    echo json_encode(array(
        "status" => "error",
        "message" => "Método no permitido"
    ));
}
?> 