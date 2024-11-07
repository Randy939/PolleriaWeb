<?php
require_once 'database.php';
require_once 'usuario.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $usuarioId = $_GET['usuario_id'];

    $usuario = new Usuario($db);
    $usuario->id = $usuarioId;

    try {
        $direcciones = $usuario->obtenerDirecciones();
        echo json_encode(['status' => 'success', 'direcciones' => $direcciones]);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
}
?> 