<?php 
    include_once "header.php";

    if(isset($_GET['edit'])){
        $single = $db->query("select * from task where id_task=".$_GET['edit']);
        $single = $single->fetch();
    }   

    if($_SERVER["REQUEST_METHOD"] == "POST"){
        
        
        $id_task=$_POST["id_task"];
        $title = trim($_POST["title"]);
        $description = trim($_POST["description"]);
        $ressources = trim($_POST["ressources"]);
        $deadline = $_POST["deadline"];
        if ($_POST["active"]=='on')
	$active=1;
	else
	$active=0;
        
        $q = $db->query("update task set 
        title='$title',
        description='$description',
        ressources='$ressources',
        deadline='$deadline',
	active='$active'	
        where id_task='$id_task'");
        
        
    
        header('Location: task.php');
        
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
    <div class="form__title">Edit tasks</div>
    <br><br>
    <p class="form__desc">
        Use this formular to update data about the tasks
    </p>
    
    <br>
    <form class="form" action="" method="POST">
        <input type="hidden" value="<?= $single['id_task']?>" name="id_task" >
        <div class="form__item">
          <label for="ttitle" class="form__label">Title</label>
          <input type="text" class="form__input"  id="ttitle" value="<?= $single['title'] ?>" name="title" placeholder="Enter the title of the task" require>
          <span class="form__error">A sample error message</span>
        </div>
        <div class="form__item">
          <label for="tdescription" class="form__label">Description</label>
          <textarea maxlength="500" class="form__input" id="tdescription" name="description" placeholder="what is the task and what are the objectives?"><?= $single['description'] ?></textarea>
          <span class="form__error">A sample error message</span>
        </div>
        <div class="form__item">
          <label for="tressources" class="form__label">Ressources</label>
          <textarea maxlength="500" class="form__input" id="tressources" name="ressources" placeholder="List the extern ressources that the student can use to accomplish the task"><?= $single['ressources'] ?></textarea>
          <span class="form__error">A sample error message</span>
        </div>
        <div class="form__item">
          <label for="tdeadline" class="form__label">Deadline</label>
          <input type="date" class="form__input form__input--small" id="tdeadline" value="<?= $single['deadline'] ?>" name="deadline"  placeholder="Enter a deadline for the task" require>
          <span class="form__error">A sample error message</span>
        </div>
	<div class="form__item">
          <label for="tactive" class="form__label">Active</label>
	  <input type="checkbox" id="tactive" name="active" placeholder="Is the task active?" <?php if ($single['active'] == 1) { echo "checked='checked'"; } ?>>
          <span class="form__error">A sample error message</span>
        </div>
        <div class="form__item">
          <button class="form__btn" type="submit">Register task</button>
        </div>
      </div>
        
      </form>
</div>
    
<?php include_once "footer.php" ?>
