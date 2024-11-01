<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/database.php';
include_once '../Models/Usuario.php';

$database = new Database();
$db = $database->getConnection();
$usuario = new Usuario($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->password) && !empty($data->nombre) && !empty($data->apellido)) {
    $usuario->nombre = $data->nombre;
    $usuario->apellido = $data->apellido;
    $usuario->email = $data->email;
    $usuario->password = password_hash($data->password, PASSWORD_DEFAULT);
    $usuario->direccion = $data->direccion ?? '';
    $usuario->telefono = $data->telefono ?? '';
    
    try {
        if($usuario->crear()) {
            http_response_code(201);
            echo json_encode(array(
                "status" => "success",
                "message" => "Usuario creado exitosamente"
            ));
        }
    } catch(Exception $e) {
        http_response_code(400);
        echo json_encode(array(
            "status" => "error",
            "message" => $e->getMessage()
        ));
        error_log("Error en registro: " . $e->getMessage());
    }
} else {
    http_response_code(400);
    echo json_encode(array(
        "status" => "error",
        "message" => "No se pueden dejar campos vacíos"
    ));
}
?> 