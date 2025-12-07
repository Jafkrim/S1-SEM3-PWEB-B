<?php

$server = "localhost";
$user = "root";
$password = "";
$nama_database = "pendaftaran_siswa";

try {
    $pdo = new PDO("mysql:host=$server;dbname=$nama_database", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Gagal terhubung dengan database: " . $e->getMessage());
}

?>