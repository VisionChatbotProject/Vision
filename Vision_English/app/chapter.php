<?php 
    include_once "header.php";

    if(isset($_GET['del'])){
        $db->query("delete from chapter where id_chapter=".$_GET['del']);
        header("Refresh:0; url=chapter.php");
    }   

?>

<div id="menubar">
        <ul id="menu">
          <!-- put class="selected" in the li tag for the selected page - to highlight which page you're on -->
          <li><a href="index.html">Home</a></li>
          <li><a href="course.php">Course</a></li>
          <li  class="selected"><a href="chapter.php">Chapters</a></li>
          <li><a href="task.php">Tasks</a></li>
          <li><a href="exam.php">Exams</a></li>
          <li><a href="topic.php">Topics</a></li>
        </ul>
      </div>
    </div>

    <div class="form__title">Chapters</div>
    <a href="add-chapter.php" class="btn-add">Add new Chapter</a>  
    
    <table width="100%">
        <tr>
            <th>ID Chapter</th>
            <th>Name</th>
            <th>Short description</th>
            <th>Content</th>
            <th>Key concepts</th>
            <th>Ressources</th>
            <th>Observations</th>
            <th>Actions</th>
        </tr>
        <?php                 
            foreach($chapters as $row):
            ?>
                <tr>
                    <td><?= $row['id_chapter'] ?></td>
                    <td><?= $row['name_chapter'] ?></td>
                    <td><?= $row['short_description'] ?></td>
                    <td><?= $row['content'] ?></td>
                    <td><?= $row['key_concepts'] ?></td>
                    <td><?= $row['ressources'] ?></td>
                    <td><?= $row['observations'] ?></td>
                    <td>
                        <a href="edit-chapter.php?edit=<?= $row['id_chapter'] ?>" class="btn-edit">Edit</a>
                        | 
                        <a href="chapter.php?del=<?= $row['id_chapter'] ?>" class="btn-edit">Delete</a>
                    </td>
                </tr>
            <?php endforeach ?>
    </table>
  
<?php include_once "footer.php" ?>
