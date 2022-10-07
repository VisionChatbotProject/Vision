<?php 
    include_once "header.php";

    // $id = isset($_GET['del']);
    if($_SERVER["REQUEST_METHOD"] == "POST"){
        
        $title = trim($_POST["titel"]);
        $description = trim($_POST["description"]);
        $ressources = trim($_POST["ressources"]);
        $deadline = $_POST["deadline"];
        if ($_POST["active"]=='on')
	$active = 1;
	else
	$active = 0;

        
        $query = $db->query("insert into task 
            ('title','description','ressources', 'deadline','active')
            values ('$title','$description','$ressources', '$deadline','$active')"
        );
    
        header('Location: task.php');
        
    }
?>
<div id="menubar">
        <ul id="menu">
          <!-- put class="selected" in the li tag for the selected page - to highlight which page you're on -->
          <li><a href="index.html">Home</a></li>
          <li><a href="course.php">Course</a></li>
          <li><a href="chapter.php">Chapter</a></li>
          <li class="selected"><a href="task.php">Tasks</a></li>
          <li><a href="exam.php">Exams</a></li>
          <li><a href="topic.php">Topics</a></li>
        </ul>
      </div>
    </div>
<div id="site_content">

    <div class="form__title">Add tasks</div>
    <br><br>
    <p class="form__desc">
        Use this formular to fill out informations about the tasks
    </p>
    
    <br>
    <form class="form" action="" method="POST">
        <div class="form__item">
          <label for="ttitel" class="form__label">Title</label>
          <input type="text" class="form__input"  id="ttitel" name="titel" placeholder="Enter the title of the task" require>
          <span class="form__error">A sample error message</span>
        </div>
        <div class="form__item">
          <label for="tdescription" class="form__label">Description</label>
          <textarea maxlength="500" class="form__input" id="tdescription" name="description" placeholder="What is the task about and what are the objectives?"></textarea>
          <span class="form__error">A sample error message</span>
        </div>
        <div class="form__item">
          <label for="aressources" class="form__label">Ressources</label>
          <textarea maxlength="500" class="form__input" id="tressources" name="ressources" placeholder="List the ressources that the student can use to accomplish the task"></textarea>
          <span class="form__error">A sample error message</span>
        </div>
        <div class="form__item">
          <label for="tdeadline" class="form__label">Deadline</label>
          <input type="date" class="form__input form__input--small" id="tdeadline" name="deadline" placeholder="Enter a deadline for the task" require>
          <span class="form__error">A sample error message</span>
        </div>
	 <div class="form__item">
          <label for="tactive" class="form__label">Active</label>
	  <input type="checkbox" id="tactive" name="active" placeholder="Is the task active?">
          <span class="form__error">A sample error message</span>
        </div>
        <div class="form__item">
          <button class="form__btn" type="submit">Register task</button>
        </div>
      </div>
        
      </form>
    </div>
<?php include_once "footer.php" ?>
