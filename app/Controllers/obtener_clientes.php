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
require_once '../Models/Usuario.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    $usuario = new Usuario($db);

    $query = "SELECT u.nombre, u.apellido, u.email, u.telefono, u.fecha_registro, 
                     GROUP_CONCAT(d.direccion SEPARATOR ', ') AS direcciones
              FROM usuarios u 
              LEFT JOIN direcciones d ON u.id = d.usuario_id 
              WHERE u.rol_id = (SELECT id FROM roles WHERE nombre = 'cliente')
              GROUP BY u.id";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $clientes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($clientes) {
        http_response_code(200);
        echo json_encode(array(
            "status" => "success",
            "clientes" => $clientes
        ));
    } else {
        http_response_code(404);
        echo json_encode(array("status" => "error", "message" => "No se encontraron clientes."));
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => $e->getMessage()));
}
?> 