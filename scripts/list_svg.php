<?php
    $data = [];

    function listFolderFiles($dir, $data){
        // Définition du chemin à explorer (adaptez à votre environnement)

        //echo 'Dir : '.$dir."<br/>";
        //$data[] = $dir;

        $ffs = scandir($dir);

        unset($ffs[array_search('.', $ffs, true)]);
        unset($ffs[array_search('..', $ffs, true)]);

        // "ouverture" du répertoire
        //$dir = opendir($dir);
        if (false === $dir) {
            echo 'Echec: Impossible d\'explorer le dossier';
        } else {
            foreach($ffs as $ff) {
                // Affichage du nom du fichier (ou sous-répertoire)
                $array = str_split($ff);

                if("." == $array[count($array) - 4] && "s" == $array[count($array) - 3] && "v" == $array[count($array) - 2] && "g" == $array[count($array) - 1]) {
                    //echo $dir.'/'.$ff."<br/>";
                    $data[] = str_replace(__DIR__.'/../', "", $dir.'/'.$ff);
                }
                else if(is_dir($dir.'/'.$ff)) {
                    $data = listFolderFiles($dir.'/'.$ff, $data);
                }
            }

            //closedir($dir);
        }

        return $data;
    }

    $data = listFolderFiles(__DIR__.'/../img', $data);

    //var_dump($data);
    //return json_encode($data);
    echo json_encode($data);
?>