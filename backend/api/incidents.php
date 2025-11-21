<?php
require_once '../config/db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET: Fetch Incidents
if ($method === 'GET') {
    $sql = "SELECT * FROM incidents ORDER BY reported_at DESC";
    $result = $conn->query($sql);
    $incidents = [];
    while($row = $result->fetch_assoc()) {
        $incidents[] = $row;
    }
    echo json_encode($incidents);
}

// POST: Report Incident (Citizen) OR Update Status (Admin)
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    // CASE 1: Admin Updating Status
    if (isset($data['action']) && $data['action'] === 'update_status') {
        $stmt = $conn->prepare("UPDATE incidents SET status = ? WHERE id = ?");
        $stmt->bind_param("si", $data['status'], $data['id']);
        
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Status Updated"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Update Failed"]);
        }
    } 
    // CASE 2: Citizen Reporting Incident
    else if(isset($data['type']) && isset($data['city'])) {
        $stmt = $conn->prepare("INSERT INTO incidents (type, city, location, description, status) VALUES (?, ?, ?, ?, 'Pending')");
        $stmt->bind_param("ssss", $data['type'], $data['city'], $data['location'], $data['description']);
        
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Incident reported successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to report"]);
        }
    }
}

$conn->close();
?>