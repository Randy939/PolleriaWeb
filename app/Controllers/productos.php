<?php
header('Access-Control-Allow-Origin: https://gentle-arithmetic-98eb61.netlify.app');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');

include_once '../config/database.php';

class ProductosController {
    private $conn;
    private $tabla_productos = "productos";
    private $tabla_categorias = "categorias";

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    // Obtener todas las categorías activas
    public function obtenerCategorias() {
        try {
            $query = "SELECT id, nombre 
                     FROM " . $this->tabla_categorias;
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            throw new Exception("Error al obtener categorías: " . $e->getMessage());
        }
    }

    // Obtener productos por categoría
    public function obtenerProductosPorCategoria($categoria_id = null) {
        try {
            $query = "SELECT p.id, p.nombre, p.descripcion, p.precio, p.imagen, 
                             p.categoria_id, c.nombre as categoria_nombre
                     FROM " . $this->tabla_productos . " p
                     INNER JOIN " . $this->tabla_categorias . " c 
                     ON p.categoria_id = c.id
                     WHERE p.estado = 1";

            if ($categoria_id) {
                $query .= " AND p.categoria_id = :categoria_id";
            }

            $query .= " ORDER BY p.nombre ASC";

            $stmt = $this->conn->prepare($query);
            
            if ($categoria_id) {
                $stmt->bindParam(":categoria_id", $categoria_id);
            }

            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            throw new Exception("Error al obtener productos: " . $e->getMessage());
        }
    }

    // Obtener un producto específico
    public function obtenerProducto($id) {
        try {
            $query = "SELECT p.*, c.nombre as categoria_nombre
                     FROM " . $this->tabla_productos . " p
                     INNER JOIN " . $this->tabla_categorias . " c 
                     ON p.categoria_id = c.id
                     WHERE p.id = :id AND p.estado = 1";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":id", $id);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            throw new Exception("Error al obtener el producto: " . $e->getMessage());
        }
    }

    // Obtener todos los productos y categorías
    public function obtenerProductosYCategorias() {
        try {
            $response = [
                "status" => "success",
                "categorias" => $this->obtenerCategorias(),
                "productos" => $this->obtenerProductosPorCategoria()
            ];

            return $response;
        } catch(Exception $e) {
            return [
                "status" => "error",
                "message" => $e->getMessage()
            ];
        }
    }
}

// Manejo de la solicitud
try {
    $controller = new ProductosController();
    
    // Obtener parámetros de la URL
    $request_method = $_SERVER["REQUEST_METHOD"];
    $path_info = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '';
    $categoria_id = isset($_GET['categoria_id']) ? $_GET['categoria_id'] : null;
    $producto_id = isset($_GET['id']) ? $_GET['id'] : null;

    switch($request_method) {
        case 'GET':
            if ($producto_id) {
                // Obtener un producto específico
                $resultado = $controller->obtenerProducto($producto_id);
            } elseif ($categoria_id) {
                // Obtener productos de una categoría específica
                $resultado = [
                    "status" => "success",
                    "productos" => $controller->obtenerProductosPorCategoria($categoria_id)
                ];
            } else {
                // Obtener todos los productos y categorías
                $resultado = $controller->obtenerProductosYCategorias();
            }
            break;
            
        default:
            $resultado = [
                "status" => "error",
                "message" => "Método no permitido"
            ];
            http_response_code(405);
            break;
    }
    
    echo json_encode($resultado);
    
} catch(Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
    http_response_code(500);
}
?> 