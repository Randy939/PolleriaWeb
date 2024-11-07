<?php
header("Access-Control-Allow-Origin: https://gentle-arithmetic-98eb61.netlify.app");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/database.php';
require_once 'usuario.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Verificar permisos de base de datos
    try {
        $testQuery = "INSERT INTO " . $table_direcciones . " 
                     (usuario_id, direccion, referencia) 
                     VALUES (0, 'test', 'test')";
        $db->prepare($testQuery);
        // Si no hay error, tiene permisos
    } catch(PDOException $e) {
        error_log("Error de permisos: " . $e->getMessage());
        throw new Exception("El usuario no tiene permisos suficientes para realizar esta operación");
    }

    $usuario = new Usuario($db);

    switch($_SERVER["REQUEST_METHOD"]) {
        case 'GET':
            if(isset($_GET['usuario_id'])) {
                $usuario->id = $_GET['usuario_id'];
                $direcciones = $usuario->obtenerDirecciones();
                
                http_response_code(200);
                echo json_encode(array(
                    "status" => "success",
                    "direcciones" => $direcciones
                ));
            }
            break;
            
        case 'POST':
            // Agregar logging para debug
            error_log("Recibiendo POST request para direcciones");
            $rawData = file_get_contents("php://input");
            error_log("Datos recibidos: " . $rawData);
            
            $data = json_decode($rawData);
            if(!empty($data->usuario_id) && !empty($data->direccion)) {
                $usuario->id = $data->usuario_id;
                $direccion = array(
                    "direccion" => $data->direccion,
                    "referencia" => $data->referencia ?? ''
                );
                
                if($usuario->agregarDireccion($direccion)) {
                    http_response_code(201);
                    echo json_encode(array(
                        "status" => "success", 
                        "message" => "Dirección agregada."
                    ));
                } else {
                    throw new Exception("No se pudo agregar la dirección");
                }
            } else {
                throw new Exception("Datos incompletos");
            }
            break;
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