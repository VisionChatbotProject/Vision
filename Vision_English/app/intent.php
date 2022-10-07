<?php 
    include_once "header.php";

    if(isset($_GET['del'])){
        $db->query("delete from intent where id_intent=".$_GET['del']);
        header("Refresh:0; url=intent.php");
    }   

?>

<div id="menubar">
        <ul id="menu">
          <!-- put class="selected" in the li tag for the selected page - to highlight which page you're on -->
          <li class="selected"><a href="index.html">Home</a></li>
          <li><a href="course.php">Course</a></li>
          <li><a href="chapter.php">Chapters</a></li>
          <li><a href="task.php">Tasks</a></li>
          <li><a href="exam.php">Exams</a></li>
          <li><a href="topic.php">Topics</a></li>
        </ul>
      </div>
    </div>
<div id="site_content">
    <div class="form__title">Intent Manager</div>
    <a href="add-intent.php" class="btn-add">Add new intent</a>  
    
    <table width="100%">
        <tr>
            <th>ID intent</th>
            <th>Intent Name</th>
            <th>Intents</th>
            <th>Response</th>
	    <th>Action</th>
	</tr>
        <?php                 
            foreach($intents as $row):
            ?>
                <tr>
                    <td><?= $row['id_intent'] ?></td>
                    <td><?= $row['intent_name'] ?></td>
                    <td><?= $row['intent_list'] ?></td>
                    <td><?= $row['response'] ?></td>
                    <td>
                        <a href="edit-intent.php?edit=<?= $row['id_intent'] ?>" class="btn-edit">Edit</a>
                        | 
                        <a href="intent.php?del=<?= $row['id_intent'] ?>" class="btn-edit">Delete</a>
                    </td>
                </tr>
            <?php endforeach ?>
    </table>

 <?php
	echo
	"<form action='' method='post'>
	<input type='submit' name='use_button' value='Train chabot' />
	</form>";
	if(isset($_POST['use_button']))
	{
        $old_path = getcwd();
        var_dump($old_path);
        chdir('/var/www/html/app');
        var_dump(getcwd()); // maybe you can run with your php i have version 7.4.3.. I need this command to run 
        //sudo screen -S actions -X stuff 'mkdir /home/try\n' in the bash sheel... if you get it... it would work
        // I tried also /etc/sudoers to change but nothing works i tried also to change chown and chmod ... not working 

        // and let's remove sudo from shell script..ok
        $output = shell_exec('sudo ./exampl.sh 2>&1'); //not working  still not working 
        var_dump($output);

        chdir($old_path);
	}

	?>
<p style="text-align:right;"><a href="chat.html" target="_blank"><img border="0" src="botimg.jpg" width="60" height="60"></a>
<br>
<a href="chat.html" class="btn-add" target="_blank">Chat mit dem Bot</a>
<br> Telegram Channel VisionBot1 or @vison2bot</p>
</div>

<?php include_once "footer.php" ?>
