<?php
include "config.php";
$id=$_GET['id'];
$sql=$pdo->prepare("SELECT foto FROM calon_siswa WHERE id=:id");
$sql->bindparam(':id',$id);
$sql->execute();
$data=$sql->fetch();
if(is_file("images/".$data['foto']))
    unlink("images/".$data['foto']);
$sql=$pdo->prepare("DELETE FROM calon_siswa WHERE id=:id");
$sql->bindparam(':id',$id);
$execute=$sql->execute();
if($execute){
    header("location: index.php");
}else{
    echo"Data gagal dihapus.<a href='index.php'>Kembali</a>";
}
?>