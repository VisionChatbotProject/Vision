f<?php 
    include_once "header.php";

    if(isset($_GET['del'])){
        $db->query("delete from course where id_course=".$_GET['del']);
        header("Refresh:0; url=course.php");
    }   

?>
 <div id="menubar">
        <ul id="menu">
          <!-- put class="selected" in the li tag for the selected page - to highlight which page you're on -->
          <li><a href="index.html">Home</a></li>
          <li class="selected"><a href="course.php">Course</a></li>
          <li><a href="chapter.php">Chapters</a></li>
          <li><a href="task.php">Tasks</a></li>
          <li><a href="exam.php">Exams</a></li>
          <li><a href="topic.php">Topics</a></li>
        </ul>
      </div>
    </div>

<div id="site_content">
<h3>Course</h3>
     
    <?php                 
      if (!$courses){ ?>
        Add new Course  
      <?php };
      foreach($courses as $row):
     ?>
    <h3> Name of the course: <?= $row['name'] ?></h3>
    <h3> Name of the teacher: <?= $row['teacher'] ?></h3>
    <h3> E-Mail of the teacher: <?= $row['email_teacher'] ?></h3>
    <h3> This course beginns at: 22.03.20022</h3>
    <h3> This course ends at: 30.09.2022</h3>
    <h3> Description of the course: <?= $row['description'] ?></h3>
    <h3> Chapters of the course: <?= $row['chapters'] ?></h3>
    <h3> Materials: <?= $row['materials'] ?></h3>
    <h3> Extern Ressources: <?= $row['externressources'] ?></h3>
    <?php endforeach ?>
    <a href="edit-course.php?edit=<?= $row['id_course'] ?>" class="btn-edit">Edit</a>
    <a href="course.php?del=<?= $row['id_course'] ?>" class="btn-edit">Delete</a>
    
</div>
<?php include_once "footer.php" ?>
