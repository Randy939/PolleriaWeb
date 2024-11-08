<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: https://gentle-arithmetic-98eb61.netlify.app");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
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

    if ($_SERVER["REQUEST_METHOD"] === 'GET') {
        if(isset($_GET['usuario_id'])) {
            $usuario->id = $_GET['usuario_id'];
            $direcciones = $usuario->obtenerDirecciones();
            
            http_response_code(200);
            echo json_encode(array(
                "status" => "success",
                "direcciones" => $direcciones
            ));
        } else {
            throw new Exception("ID de usuario no proporcionado");
        }
    }

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

    if ($_SERVER["REQUEST_METHOD"] === 'PUT') {
        $rawData = file_get_contents("php://input");
        $data = json_decode($rawData);
        
        if (empty($data->direccion_id) || empty($data->usuario_id) || empty($data->direccion)) {
            throw new Exception("Datos incompletos");
        }

        $usuario->id = $data->usuario_id;
        $direccion = array(
            "direccion" => $data->direccion,
            "referencia" => $data->referencia ?? ''
        );
        
        if ($usuario->actualizarDireccion($data->direccion_id, $direccion)) {
            http_response_code(200);
            echo json_encode(array(
                "status" => "success", 
                "message" => "Dirección actualizada correctamente"
            ));
        } else {
            throw new Exception("No se pudo actualizar la dirección");
        }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        if (!isset($_GET['id']) || !isset($_GET['usuario_id'])) {
            throw new Exception("ID de dirección o usuario no proporcionado");
        }

        $usuario->id = $_GET['usuario_id'];
        
        if ($usuario->eliminarDireccion($_GET['id'])) {
            http_response_code(200);
            echo json_encode(array(
                "status" => "success",
                "message" => "Dirección eliminada correctamente"
            ));
        } else {
            throw new Exception("No se pudo eliminar la dirección");
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