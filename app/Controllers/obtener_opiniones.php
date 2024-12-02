<?php
header("Access-Control-Allow-Origin: https://gentle-arithmetic-98eb61.netlify.app");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Manejar preflight OPTIONS request
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

    // Obtener todas las opiniones
    $query = "SELECT o.*, u.nombre AS usuario_nombre, p.nombre AS producto_nombre 
              FROM opiniones o 
              JOIN usuarios u ON o.usuario_id = u.id 
              JOIN productos p ON o.producto_id = p.id";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $opiniones = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($opiniones) {
        http_response_code(200);
        echo json_encode(array(
            "status" => "success",
            "opiniones" => $opiniones
        ));
    } else {
        http_response_code(404);
        echo json_encode(array("status" => "error", "message" => "No se encontraron opiniones."));
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => $e->getMessage()));
}
?>