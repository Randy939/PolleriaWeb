<?php
header("Access-Control-Allow-Origin: https://gentle-arithmetic-98eb61.netlify.app");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';
require_once '../Models/reserva.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    $reserva = new Reserva($db);
    
    $data = json_decode(file_get_contents("php://input"));
    
    if(!empty($data->usuario_id) && 
       !empty($data->fecha_reserva) && 
       !empty($data->hora_reserva) && 
       !empty($data->num_personas)) {
        
        $reserva->usuario_id = $data->usuario_id;
        $reserva->fecha_reserva = $data->fecha_reserva;
        $reserva->hora_reserva = $data->hora_reserva;
        $reserva->num_personas = $data->num_personas;
        $reserva->ocasion = $data->ocasion;
        $reserva->comentarios = $data->comentarios ?? "";
        
        if($reserva->crear()) {
            http_response_code(201);
            echo json_encode(array(
                "status" => "success",
                "message" => "Reserva creada exitosamente"
            ));
        } else {
            throw new Exception("No se pudo crear la reserva");
        }
    } else {
        throw new Exception("Datos incompletos");
    }
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "status" => "error",
        "message" => $e->getMessage()
    ));
}
?> 