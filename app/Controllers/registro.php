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
        $usuario->password = password_hash($_POST['password'], PASSWORD_DEFAULT);
        $usuario->direccion = !empty($_POST['direccion']) ? htmlspecialchars(strip_tags($_POST['direccion'])) : "";
        $usuario->telefono = !empty($_POST['telefono']) ? htmlspecialchars(strip_tags($_POST['telefono'])) : "";

        try {
            if($usuario->crear()) {
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
                echo json_encode(array(
                    "status" => "error",
                    "message" => "No se pudo crear el usuario"
                ));
            }
        } catch(Exception $e) {
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