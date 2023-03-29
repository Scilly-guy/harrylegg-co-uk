<?php

    error_log("POST:".print_r($_POST,true));
    error_log("GET:".print_r($_GET,true));
    $file=file("achievements.txt");
    error_log("File:".print_r($file,true));
    $scrollerRow=0;
    $gamerRow=1;
    $programmerRow=2;
    $recruiterRow=3;
    $networkerRow=4;
    $collectorRow=5;
    $curiousRow=6;
    $onboardRow=7;

    $achievementCount=array(
        "scroller"=>(int)$file[$scrollerRow],
        "gamer"=>(int)$file[$gamerRow],
        "programmer"=>(int)$file[$programmerRow],
        "recruiter"=>(int)$file[$recruiterRow],
        "networker"=>(int)$file[$networkerRow],
        "collector"=>(int)$file[$collectorRow],
        "curious"=>(int)$file[$curiousRow],
        "mystery"=>(int)$file[$onboardRow]
    );

    if(isset($_POST['scroller'])){
        $achievementCount["scroller"]++;
    }
    if(isset($_POST['gamer'])){
        $achievementCount['gamer']++;
    }
    if(isset($_POST['programmer'])){
        $achievementCount['programmer']++;
    }
    if(isset($_POST['recruiter'])){
        $achievementCount['recruiter']++;
    }
    if(isset($_POST['networker'])){
        $achievementCount['networker']++;
    }
    if(isset($_POST['collector'])){
        $achievementCount['collector']++;
    }
    if(isset($_POST['curious'])){
        $achievementCount['curious']++;
    }
    if(isset($_POST['mystery'])){
        $achievementCount['mystery']++;
    }

    
    file_put_contents("achievements.txt",implode("\r\n",$achievementCount));
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($achievementCount);
?>