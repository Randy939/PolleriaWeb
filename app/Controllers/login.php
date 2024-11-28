<?php
// Headers CORS
header('Access-Control-Allow-Origin: https://gentle-arithmetic-98eb61.netlify.app');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $rawInput = file_get_contents("php://input");
    $data = json_decode($rawInput, true);
    
    if (!$data || !isset($data['email']) || !isset($data['password'])) {
        throw new Exception("Datos de login incompletos");
    }

    require_once '../config/database.php';
    $database = new Database();
    $db = $database->getConnection();

    // Verificar credenciales
    $query = "SELECT u.id, u.nombre, u.apellido, u.email, u.password, r.nombre AS rol 
              FROM usuarios u 
              JOIN roles r ON u.rol_id = r.id 
              WHERE u.email = :email LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $data['email']);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (password_verify($data['password'], $user['password'])) {
            http_response_code(200);
            echo json_encode([
                "status" => "success",
                "message" => "Login exitoso",
                "data" => [
                    "id" => $user['id'],
                    "nombre" => $user['nombre'],
                    "email" => $user['email'],
                    "rol" => $user['rol']
                ]
            ]);
        } else {
            error_log("Contraseña incorrecta para el email: " . $data['email']);
            http_response_code(401);
            echo json_encode([
                "status" => "error",
                "message" => "Credenciales inválidas"
            ]);
        }
    } else {
        http_response_code(401);
        echo json_encode([
            "status" => "error",
            "message" => "Credenciales inválidas"
        ]);
    }

} catch (Exception $e) {
    error_log("Error en login.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Error del servidor: " . $e->getMessage()
    ]);
}
?> 