<?php
require_once '../config/db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET: Fetch All Safety Places (For Admin & Citizen)
if ($method === 'GET') {
    $sql = "SELECT * FROM safety_places ORDER BY id DESC";
    $result = $conn->query($sql);
    $places = [];
    while($row = $result->fetch_assoc()) {
        $places[] = $row;
    }
    echo json_encode($places);
}

// POST: Add Safety Place (Admin Only)
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if(isset($data['name']) && isset($data['city'])) {
        $stmt = $conn->prepare("INSERT INTO safety_places (name, city, capacity, status) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssis", $data['name'], $data['city'], $data['capacity'], $data['status']);
        
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Safety Place added"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to add place"]);
        }
    }
}
$conn->close();
?>