<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Prevenir cualquier salida antes de los headers
ob_start();

// Headers CORS
header('Access-Control-Allow-Origin: https://gentle-arithmetic-98eb61.netlify.app');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

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
            ob_clean(); // Limpiar cualquier salida anterior
            echo json_encode([
                'status' => 'success',
                'usuario' => $usuario
            ]);
        } else {
            ob_clean(); // Limpiar cualquier salida anterior
            echo json_encode([
                'status' => 'error',
                'message' => 'Usuario no encontrado'
            ]);
        }
    } else {
        ob_clean(); // Limpiar cualquier salida anterior
        echo json_encode([
            'status' => 'error',
            'message' => 'ID de usuario no proporcionado'
        ]);
    }
} catch (Exception $e) {
    ob_clean(); // Limpiar cualquier salida anterior
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
ob_end_flush();
?> 