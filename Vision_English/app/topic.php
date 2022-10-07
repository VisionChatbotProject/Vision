<?php 
    include_once "header.php";

    if(isset($_GET['del'])){
        $db->query("delete from topic where id_topic=".$_GET['del']);
        header("Refresh:0; url=topic.php");
    }   

?>

<div id="menubar">
        <ul id="menu">
          <!-- put class="selected" in the li tag for the selected page - to highlight which page you're on -->
          <li><a href="index.html">Home</a></li>
          <li><a href="course.php">Course</a></li>
          <li><a href="chapter.php">Chapters</a></li>
          <li><a href="task.php">Tasks</a></li>
          <li><a href="exam.php">Exams</a></li>
          <li class="selected"><a href="topic.php">Topics</a></li>
        </ul>
      </div>
    </div>
<div id="site_content">
    <div class="form__title">Topics</div>
    <a href="add-topic.php" class="btn-add">Add new topic</a>  
    
    <table width="100%">
        <tr>
            <th>ID topic</th>
            <th>Topic</th>
            <th>Meaning</th>
            <th>Extra Information</th>
            <th>Action</th>
        </tr>
        <?php                 
            foreach($topics as $row):
            ?>
                <tr>
                    <td><?= $row['id_topic'] ?></td>
                    <td><?= $row['topic'] ?></td>
                    <td><?= $row['meaning'] ?></td>
                    <td><?= $row['information'] ?></td>
                    <td>
                        <a href="edit-topic.php?edit=<?= $row['id_topic'] ?>" class="btn-edit">Edit</a>
                        | 
                        <a href="topic.php?del=<?= $row['id_topic'] ?>" class="btn-edit">Delete</a>
                    </td>
                </tr>
            <?php endforeach ?>
    </table>
</div>
  
<?php include_once "footer.php" ?>
