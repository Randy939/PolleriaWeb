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

class OpinionesController {
    private $conn;
    private $tabla_opiniones = "opiniones";

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function crearOpinion($data) {
        try {
            $query = "INSERT INTO " . $this->tabla_opiniones . " (usuario_id, producto_id, calificacion, comentario) VALUES (:usuario_id, :producto_id, :calificacion, :comentario)";
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(":usuario_id", $data->usuario_id);
            $stmt->bindParam(":producto_id", $data->producto_id);
            $stmt->bindParam(":calificacion", $data->calificacion);
            $stmt->bindParam(":comentario", $data->comentario);

            if ($stmt->execute()) {
                return ["status" => "success"];
            }
            return ["status" => "error", "message" => "No se pudo crear la opinión"];
        } catch (PDOException $e) {
            return ["status" => "error", "message" => "Error al crear la opinión: " . $e->getMessage()];
        }
    }
}

try {
    $controller = new OpinionesController();
    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->usuario_id) && !empty($data->producto_id) && !empty($data->calificacion) && !empty($data->comentario)) {
        $resultado = $controller->crearOpinion($data);
        echo json_encode($resultado);
    } else {
        echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    http_response_code(500);
}
?>
