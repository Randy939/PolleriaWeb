<?php
header('Access-Control-Allow-Origin: https://gentle-arithmetic-98eb61.netlify.app');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/database.php';
include_once '../Models/Opinion.php';

$database = new Database();
$db = $database->getConnection();
$opinion = new Opinion($db);

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->usuario_id) && !empty($data->producto_id) && !empty($data->calificacion) && !empty($data->comentario)) {
    $opinion->usuario_id = $data->usuario_id;
    $opinion->producto_id = $data->producto_id;
    $opinion->calificacion = $data->calificacion;
    $opinion->comentario = $data->comentario;

    if ($opinion->crear()) {
        echo json_encode(["status" => "success", "message" => "Opinión guardada exitosamente."]);
    } else {
        echo json_encode(["status" => "error", "message" => "No se pudo guardar la opinión."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Datos incompletos."]);
}
?>