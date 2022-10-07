<?php
try{
    $db = new PDO('sqlite:/home/chatbot/chatbot.db');
    
    $tasks = $db->query(
        'select * from task');
    
    $chapters = $db->query(
        'select * from chapter');

    $courses = $db->query('select * from course');
    $topics = $db->query('select * from topic');
    $intents = $db->query('select * from intent');

    
}catch(PDOException $e)
{
    echo $e->getMessage();
}

