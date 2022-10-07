<?php 
    include_once "header.php";

    if(isset($_GET['edit'])){
        $single = $db->query("select * from topic where id_topic=".$_GET['edit']);
        $single = $single->fetch();
    }   

    if($_SERVER["REQUEST_METHOD"] == "POST"){
        
        
        $id_topic=$_POST["id_topic"];
	$topic=$_POST["topic"];
        $meaning = trim($_POST["meaning"]);
        $information = trim($_POST["information"]);

        $q = $db->query("update topic set 
        topic='$topic',
        meaning='$meaning',
        information='$information'
        where id_topic='$id_topic'");
       
        header('Location: topic.php');
        
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
    <div class="form__title">Edit Topic</div>
    <br><br>
    <p class="form__desc">
        Use this formular to update data about the topic
    </p>
    
    <br>
    <form class="form" action="" method="POST">
        <input type="hidden" value="<?= $single['id_topic']?>" name="id_topic" >
        <div class="form__item">
          <label for="ttopic" class="form__label">Title</label>
          <input type="text" class="form__input"  id="ttopic" value="<?= $single['topic'] ?>" name="topic" placeholder="Enter topic" require>
          <span class="form__error">A sample error message</span>
        </div>

	<div class="form__item">
          <label for="tmeaning" class="form__label">Meaning</label>
          <textarea maxlength="500" class="form__input" id="tmeaning" name="meaning" placeholder="Meaning of topic" require><?= $single['meaning'] ?></textarea>
          <span class="form__error">A sample error message</span>
        </div>
	<div class="form__item">
          <label for="tinformation" class="form__label">Information</label>
          <textarea maxlength="500" class="form__input" id="tinformation" name="information" placeholder="Additional information about the topic example: http://references.pdf"><?= $single['information'] ?></textarea>
          <span class="form__error">A sample error message</span>
        </div>

        <div class="form__item">
          <button class="form__btn" type="submit">Register topic</button>
        </div>
      </div>
        
      </form>
</div>
    
<?php include_once "footer.php" ?>
