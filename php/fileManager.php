<?php
    if($_GET["mode"] == "save"){
        $_GET["stylesheet"];
        $_GET["HTML"];
        $css = fopen("./css.txt","w");
        fwrite($css,$_GET["stylesheet"]);
        fclose($css);

        $html = fopen("./html.txt","w");
        fwrite($html,$_GET["HTML"]);
        fclose($html);
    }else{
        $css = fopen("./css.txt","r");
        $res[0] = "";
        if(filesize("./css.txt") > 0){
            $res[0] = fread($css,filesize("./css.txt"));
        }
        fclose($css);
        $res[1] = "";
        $HTML = fopen("./html.txt","r");
        if(filesize("./html.txt") > 0){
            $res[1] = fread($HTML,filesize("./html.txt"));
        }
        fclose($HTML);
        echo(json_encode($res));
    }
    
?>