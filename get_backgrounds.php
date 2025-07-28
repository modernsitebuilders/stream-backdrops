<?php
header('Content-Type: application/json');

$backgrounds = [];
$dir = 'backgrounds/';
$allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

if (is_dir($dir)) {
    foreach (scandir($dir) as $file) {
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (!in_array($file, ['.', '..']) && in_array($ext, $allowedExtensions)) {
            $backgrounds[] = $dir . $file;
        }
    }
}

echo json_encode($backgrounds);
?>
