<?php
header("Access-Control-Allow-Origin: https://gentle-arithmetic-98eb61.netlify.app");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'database.php';
require_once 'usuario.php';

try {
    $database = new Database();
    $db = $database->getConnection();
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
            $data = json_decode(file_get_contents("php://input"));
            if(!empty($data->usuario_id) && !empty($data->direccion)) {
                $usuario->id = $data->usuario_id;
                $direccion = array(
                    "direccion" => $data->direccion,
                    "referencia" => $data->referencia ?? ''
                );
                
                if($usuario->agregarDireccion($direccion)) {
                    http_response_code(201);
                    echo json_encode(array("status" => "success", "message" => "Dirección agregada."));
                }
            }
            break;
    }
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => $e->getMessage()));
}
?> 