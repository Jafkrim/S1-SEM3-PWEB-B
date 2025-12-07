<?php
// Load file config.php (koneksi PDO)
include "config.php";

// Ambil data ID yang dikirim oleh form_ubah.php melalui URL
$id =$_GET['id'];

// Ambil Data yang Dikirim dari Form
$nis           = $_POST['nis'];
$nama          = $_POST['nama'];
$jenis_kelamin = $_POST['jenis_kelamin'];
$telp          = $_POST['telp'];
$alamat        = $_POST['alamat'];

// Ambil data foto yang dipilih dari form
$foto = $_FILES['foto']['name'];
$tmp  = $_FILES['foto']['tmp_name'];

// Jika user tidak memilih file foto pada form (tetap pakai foto lama)
if (empty($foto)) {
        $sql = $pdo->prepare("UPDATE calon_siswa SET nis=:nis, nama=:nama, jenis_kelamin=:jk, telp=:telp, alamat=:alamat WHERE id=:id");
        $sql->bindParam(':nis', $nis);
        $sql->bindParam(':nama', $nama);
        $sql->bindParam(':jk', $jenis_kelamin);
        $sql->bindParam(':telp', $telp);
        $sql->bindParam(':alamat', $alamat);
        $sql->bindParam(':id', $id);
        $execute = $sql->execute(); // Eksekusi / Jalankan query

        if ($sql) {
            header("Location: index.php");
        } else {
            echo "Maaf, Terjadi kesalahan saat mencoba untuk menyimpan data ke database.";
            echo "<br><a href='form_ubah.php'>Kembali Ke Form</a>";
        }
} else { // Jika user memilih foto / mengisi input file foto pada form
    // Rename nama fotonya dengan menambahkan tanggal dan jam upload
    $fotobaru = date('dmYHis') . $foto;

    // Set path folder tempat menyimpan fotonya
    $path = "images/" . $fotobaru;

    // Proses upload
    if (move_uploaded_file($tmp, $path)) { // Cek apakah gambar berhasil diupload atau tidak
        // Query untuk menampilkan data siswa berdasarkan ID yang dikirim
        $sql = $pdo->prepare("SELECT foto FROM calon_siswa WHERE id=:id");
        $sql->bindParam(':id', $id);
        $sql->execute();
        $data = $sql->fetch();

        // Cek apakah file foto sebelumnya ada di folder images
        if (is_file("images/" . $data['foto']))
            // Hapus file foto sebelumnya yang ada di folder images
            unlink("images/" . $data['foto']);

        // Proses ubah data ke Database (termasuk mengganti nama foto)
        $sql = $pdo->prepare("UPDATE calon_siswa SET nis=:nis, nama=:nama, jenis_kelamin=:jk, telp=:telp, alamat=:alamat, foto=:foto WHERE id=:id");
        $sql->bindParam(':nis', $nis);
        $sql->bindParam(':nama', $nama);
        $sql->bindParam(':jk', $jenis_kelamin);
        $sql->bindParam(':telp', $telp);
        $sql->bindParam(':alamat', $alamat);
        $sql->bindParam(':foto', $fotobaru);
        $sql->bindParam(':id', $id);
        $execute = $sql->execute(); // Eksekusi / Jalankan query

            if ($sql) {
                header("Location: index.php");
            } else {
                echo "Maaf, Terjadi kesalahan saat mencoba untuk menyimpan data ke database.";
                echo "<br><a href='form_ubah.php'>Kembali Ke Form</a>";
            }
        
    } else {
        // Jika gagal upload
        echo "Maaf, Gagal upload gambar.";
        echo "<br><a href='form_ubah.php'>Kembali Ke Form</a>";
    }
}
?>