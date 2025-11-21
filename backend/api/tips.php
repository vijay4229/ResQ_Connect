<?php
require_once '../config/db_connect.php';

// Fetch all tips
$sql = "SELECT * FROM safety_tips";
$result = $conn->query($sql);

$tips = [];
while($row = $result->fetch_assoc()) {
    $tips[] = $row;
}

echo json_encode($tips);
$conn->close();
?>