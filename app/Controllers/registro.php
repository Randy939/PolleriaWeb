<?php
header('Access-Control-Allow-Origin: https://gentle-arithmetic-98eb61.netlify.app');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Content-Type: application/json');

include_once '../config/database.php';
include_once '../Models/Usuario.php';

$database = new Database();
$db = $database->getConnection();
$usuario = new Usuario($db);

// Obtener los datos enviados
$data = json_decode(file_get_contents("php://input"));

// Validar datos requeridos
if(
    !empty($data->nombre) &&
    !empty($data->apellido) &&
    !empty($data->email) &&
    !empty($data->password)
) {
    // Asignar valores
    $usuario->nombre = htmlspecialchars(strip_tags($data->nombre));
    $usuario->apellido = htmlspecialchars(strip_tags($data->apellido));
    $usuario->email = htmlspecialchars(strip_tags($data->email));
    $usuario->password = password_hash($data->password, PASSWORD_DEFAULT);
    $usuario->direccion = !empty($data->direccion) ? htmlspecialchars(strip_tags($data->direccion)) : "";
    $usuario->telefono = !empty($data->telefono) ? htmlspecialchars(strip_tags($data->telefono)) : "";

    try {
        if($usuario->crear()) {
            http_response_code(201);
            echo json_encode(array(
                "status" => "success",
                "message" => "Usuario creado exitosamente"
            ));
        } else {
            http_response_code(503);
            echo json_encode(array(
                "status" => "error",
                "message" => "No se pudo crear el usuario"
            ));
        }
    } catch(Exception $e) {
        http_response_code(400);
        echo json_encode(array(
            "status" => "error",
            "message" => $e->getMessage()
        ));
    }
} else {
    http_response_code(400);
    echo json_encode(array(
        "status" => "error",
        "message" => "No se pueden dejar campos vacíos"
    ));
}
?> 