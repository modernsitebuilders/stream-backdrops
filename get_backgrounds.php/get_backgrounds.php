<?php
header('Content-Type: application/json');

$backgrounds = [];
$dir = 'backgrounds/';

if (is_dir($dir)) {
    foreach (scandir($dir) as $file) {
        if ($file !== '.' && $file !== '..' && !is_dir($dir.$file)) {
            $backgrounds[] = $dir.$file;
        }
    }
}

echo json_encode($backgrounds);
?>