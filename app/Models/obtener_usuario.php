<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// Prevenir cualquier salida antes de los headers
ob_start();
// Configurar headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'database.php';
require_once 'usuario.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
        $query = "SELECT id, nombre, apellido, email, telefono, direccion 
                 FROM usuarios 
                 WHERE id = :id 
                 LIMIT 1";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $_GET['id']);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode([
                'status' => 'success',
                'usuario' => $usuario
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Usuario no encontrado'
            ]);
        }
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'ID de usuario no proporcionado'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}

// Limpiar cualquier salida pendiente
ob_end_flush();
?> 