<?php
header("Access-Control-Allow-Origin: https://gentle-arithmetic-98eb61.netlify.app");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'database.php';
require_once 'usuario.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    $usuario = new Usuario($db);
    
    $data = json_decode(file_get_contents("php://input"));
    
    if(!empty($data->id) && !empty($data->password_actual) && !empty($data->password_nueva)) {
        $usuario->id = $data->id;
        $usuario->password = $data->password_nueva;
        
        if($usuario->cambiarPassword($data->password_actual)) {
            http_response_code(200);
            echo json_encode(array("status" => "success", "message" => "Contraseña actualizada."));
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