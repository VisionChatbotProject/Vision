<?php

    include_once "header.php";
    //to load top menu

    if(isset($_GET['del'])){
        $db->query("delete from task where id_task=".$_GET['del']);
        header("Refresh:0; url=task.php");
    }



?>

<div id="menubar">
        <ul id="menu">
          <!-- put class="selected" in the li tag for the selected page - to highlight which page you're on -->
          <li><a href="index.html">Home</a></li>
          <li><a href="course.php">Course</a></li>
          <li><a href="chapter.php">Chapters</a></li>
          <li class="selected"><a href="task.php">Tasks</a></li>
          <li><a href="exam.php">Exams</a></li>
          <li><a href="topic.php">Topics</a></li>
        </ul>
      </div>
    </div>

<div id="site_content">
    <div class="form__title">Tasks</div>
    <a href="add-task.php" class="btn-add">Add new task/assignment</a>

    <table>
        <tr>
            <th>Id task</th>
            <th>Title</th>
            <th>Description</th>
            <th>Resources</th>
            <th>Deadline</th>
            <th>Active</th>
            <th>#</th>
        </tr>
            <?php
                foreach($tasks as $row):
            ?>
                <tr>
                    <td><?= $row['id_task'] ?></td>
                    <td><?= $row['title'] ?></td>
                    <td><?= $row['description'] ?></td>
                    <td><?= $row['ressources'] ?></td>
                    <td><?= $row['deadline'] ?></td>
                    <td><?= $row['active'] ?></td>
                    <td>
                        <a href="edit-task.php?edit=<?= $row['id_task'] ?>" class="btn-edit">Edit</a>
                        |
                        <a href="task.php?del=<?= $row['id_task'] ?>" class="btn-edit">Delete</a>
                    </td>
                </tr>
            <?php endforeach ?>
    </table>

</div>

<?php include_once "footer.php" ?>
