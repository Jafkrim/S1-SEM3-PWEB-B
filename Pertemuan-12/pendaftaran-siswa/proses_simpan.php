<?php
include "config.php";

$nis = $_POST['nis'];
$nama = $_POST['nama'];

$jenis_kelamin = isset($_POST['jenis_kelamin']) ? $_POST['jenis_kelamin'] : null;
if ($jenis_kelamin === null) {
    die("Jenis kelamin belum dipilih.<br><a href='form_simpan.php'>Kembali</a>");
}

$telp = $_POST['telp'];
$alamat = $_POST['alamat'];

$foto = $_FILES['foto']['name'];
$tmp  = $_FILES['foto']['tmp_name'];

$fotobaru = date('dmYHis') . '_' . $foto;
$path = "images/" . $fotobaru;

if (!is_dir("images")) {
    mkdir("images");
}

if(move_uploaded_file($tmp, $path)){
    
    $sql = $pdo->prepare("INSERT INTO calon_siswa(nis, nama, jenis_kelamin, telp, alamat, foto)
                          VALUES(:nis, :nama, :jk, :telp, :alamat, :foto)");

    $sql->bindParam(':nis', $nis);
    $sql->bindParam(':nama', $nama);
    $sql->bindParam(':jk', $jenis_kelamin);
    $sql->bindParam(':telp', $telp);
    $sql->bindParam(':alamat', $alamat);
    $sql->bindParam(':foto', $fotobaru);

    if($sql->execute()){
        header("Location: index.php");
        exit();
    } else {
        echo "Maaf, terjadi kesalahan saat menyimpan ke database.";
        echo "<br><a href='form_simpan.php'>Kembali ke Form</a>";
    }

} else {
    echo "Maaf, gambar gagal diupload.";
    echo "<br><a href='form_simpan.php'>Kembali ke Form</a>";
}
?>