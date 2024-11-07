<?php
// Habilitar reporte de errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: https://gentle-arithmetic-98eb61.netlify.app");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'database.php';
require_once 'usuario.php';

try {
    // Capturar el input raw
    $rawInput = file_get_contents("php://input");
    error_log("Input recibido: " . $rawInput);
    
    $data = json_decode($rawInput);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Error decodificando JSON: " . json_last_error_msg());
    }
    
    if(!empty($data->id) && !empty($data->password_actual) && !empty($data->password_nueva)) {
        $database = new Database();
        $db = $database->getConnection();
        $usuario = new Usuario($db);
        
        $usuario->id = $data->id;
        $usuario->password = $data->password_nueva;
        
        if($usuario->cambiarPassword($data->password_actual)) {
            http_response_code(200);
            echo json_encode(array("status" => "success", "message" => "Contraseña actualizada."));
        }
    } else {
        throw new Exception("Datos incompletos");
    }
} catch(Exception $e) {
    error_log("Error en cambiar_password.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => $e->getMessage()));
}
?> 