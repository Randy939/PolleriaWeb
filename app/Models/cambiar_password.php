<?php
header("Access-Control-Allow-Origin: https://gentle-arithmetic-98eb61.netlify.app");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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
    $data = json_decode(file_get_contents("php://input"));
    
    if(!empty($data->id) && !empty($data->password_actual) && !empty($data->password_nueva)) {
        $database = new Database();
        $db = $database->getConnection();
        $usuario = new Usuario($db);
        
        $usuario->id = $data->id;
        $usuario->password = $data->password_nueva;
        
        if($usuario->cambiarPassword($data->password_actual)) {
            http_response_code(200);
            echo json_encode(array("status" => "success", "message" => "Contraseña actualizada correctamente"));
        } else {
            throw new Exception("La contraseña actual es incorrecta");
        }
    } else {
        throw new Exception("Faltan datos requeridos");
    }
} catch(Exception $e) {
    http_response_code(200); // Cambiamos a 200 para evitar errores CORS
    echo json_encode(array("status" => "error", "message" => $e->getMessage()));
}
?> 