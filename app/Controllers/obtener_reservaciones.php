<?php
header("Access-Control-Allow-Origin: https://gentle-arithmetic-98eb61.netlify.app");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");

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

    $query = "SELECT u.nombre, r.fecha_reserva, r.hora_reserva, r.num_personas, r.ocasion, r.comentarios
              FROM reservas r
              JOIN usuarios u ON r.usuario_id = u.id";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $reservaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($reservaciones) {
        http_response_code(200);
        echo json_encode(array(
            "status" => "success",
            "reservaciones" => $reservaciones
        ));
    } else {
        http_response_code(404);
        echo json_encode(array("status" => "error", "message" => "No se encontraron reservaciones."));
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => $e->getMessage()));
}
?> 