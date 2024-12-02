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
require_once '../Models/opinion.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    $opinion = new Opinion($db);

    $data = json_decode(file_get_contents("php://input"));

    // Usar error_log para depuración
    error_log(print_r($data, true)); // Esto enviará los datos al registro de errores

    if (!empty($data->usuario_id) && !empty($data->producto_id) && !empty($data->calificacion) && !empty($data->comentario)) {
        $opinion->usuario_id = $data->usuario_id;
        $opinion->producto_id = $data->producto_id;
        $opinion->calificacion = $data->calificacion;
        $opinion->comentario = $data->comentario;

        if ($opinion->crear()) {
            http_response_code(201);
            echo json_encode(array("status" => "success", "message" => "Comentario creado exitosamente"));
        } else {
            throw new Exception("No se pudo crear el comentario");
        }
    } else {
        throw new Exception("Datos incompletos");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => $e->getMessage()));
}
?>