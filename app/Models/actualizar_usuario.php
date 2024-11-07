<?php
header("Access-Control-Allow-Origin: https://gentle-arithmetic-98eb61.netlify.app");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Manejar preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';
require_once 'usuario.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    $usuario = new Usuario($db);
    
    $data = json_decode(file_get_contents("php://input"));
    
    if(!empty($data->id)) {
        $usuario->id = $data->id;
        $usuario->nombre = $data->nombre;
        $usuario->apellido = $data->apellido;
        $usuario->email = $data->email;
        $usuario->telefono = $data->telefono;
        $usuario->direccion = $data->direccion;
        
        if($usuario->actualizar()) {
            http_response_code(200);
            echo json_encode(array("status" => "success", "message" => "Usuario actualizado."));
        } else {
            http_response_code(503);
            echo json_encode(array("status" => "error", "message" => "No se pudo actualizar el usuario."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("status" => "error", "message" => "Datos incompletos."));
    }
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => $e->getMessage()));
}
?> 