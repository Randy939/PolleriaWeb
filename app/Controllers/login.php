<?php
header("Access-Control-Allow-Origin: https://gentle-arithmetic-98eb61.netlify.app");
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

if(!empty($data->email) && !empty($data->password)) {
    $usuario->email = $data->email;
    $usuario->password = $data->password;
    
    try {
        $result = $usuario->login();
        
        if($result) {
            http_response_code(200);
            echo json_encode(array(
                "status" => "success",
                "message" => "Login exitoso",
                "data" => $result
            ));
        } else {
            http_response_code(401);
            echo json_encode(array(
                "status" => "error",
                "message" => "Email o contraseña incorrectos"
            ));
        }
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(array(
            "status" => "error",
            "message" => $e->getMessage()
        ));
    }
} else {
    http_response_code(400);
    echo json_encode(array(
        "status" => "error",
        "message" => "Datos incompletos"
    ));
}
?> 