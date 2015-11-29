<?php
    
  ini_set("display_errors", 0);

  if ($_FILES["file"]["error"] > 0){
    
    echo "Return Code: " . $_FILES["file"]["error"] . "<br />";
  
  }else{

    $name = $_FILES["file"]["name"];

    echo "Uploaded: $name (" . number_format($_FILES["file"]["size"] / 1024 / 1024, 2) . " MB)<br />";


    if (file_exists($_FILES["file"]["name"])){
        unlink($_FILES["file"]["name"]);
    }
    
    if(move_uploaded_file($_FILES["file"]["tmp_name"],$name)){
      echo "View image <a href='" . $n."' target='_blank'>here</a>";
    }else{
      echo "The file wasn't uploaded";
    }

    $n = basename($name).".html";
    $f = fopen($n, "w");
    fwrite($f, "<html><head><title>".$_POST["caption"]."</title></head><body><ul>\n");
    foreach($_POST as $k => $v) {
	    echo "<li>$k: $v</li>";
    }
    $a = getimagesize($name);
    $width = $a[0] / $a[1] * 480;
    fwrite($f,"</ul><a href='$name'><img src='$name' height='480' width='$width'/></a>");
    fwrite($f,"</body></html>");
    fclose($f);
   
  }
  

?>
