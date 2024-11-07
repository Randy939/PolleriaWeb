<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: https://gentle-arithmetic-98eb61.netlify.app");  // Cambia esto según tu dominio
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/database.php';
require_once 'usuario.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    $usuario = new Usuario($db);

    if ($_SERVER["REQUEST_METHOD"] === 'POST') {
        $rawData = file_get_contents("php://input");
        error_log("Datos recibidos: " . $rawData);
        
        $data = json_decode($rawData);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Error al decodificar JSON: " . json_last_error_msg());
        }

        if (empty($data->usuario_id)) {
            throw new Exception("ID de usuario no proporcionado");
        }

        if (empty($data->direccion)) {
            throw new Exception("Dirección no proporcionada");
        }

        $usuario->id = $data->usuario_id;
        $direccion = array(
            "direccion" => $data->direccion,
            "referencia" => $data->referencia ?? ''
        );
        
        if ($usuario->agregarDireccion($direccion)) {
            http_response_code(201);
            echo json_encode(array(
                "status" => "success", 
                "message" => "Dirección agregada correctamente"
            ));
        } else {
            throw new Exception("No se pudo agregar la dirección");
        }
    }
} catch(Exception $e) {
    error_log("Error en direcciones.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(array(
        "status" => "error", 
        "message" => $e->getMessage()
    ));
}
?> 