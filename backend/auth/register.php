<?php
require_once '../config/db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['username']) && isset($data['password'])) {
    $username = $data['username'];
    $password = $data['password'];

    // 1. Check if username already exists
    $checkStmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $checkStmt->bind_param("s", $username);
    $checkStmt->execute();
    $result = $checkStmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "Username already taken"]);
    } else {
        // 2. Create new Citizen (Hardcoded role)
        // Hash the password for security
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $role = 'citizen'; // FORCE ROLE TO CITIZEN

        $insertStmt = $conn->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
        $insertStmt->bind_param("sss", $username, $hashed_password, $role);

        if ($insertStmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Registration successful"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Database error"]);
        }
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input"]);
}
$conn->close();
?>