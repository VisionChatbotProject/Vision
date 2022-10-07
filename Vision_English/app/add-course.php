<?php 
    include_once "header.php";

    // $id = isset($_GET['del']);
    if($_SERVER["REQUEST_METHOD"] == "POST"){
        
        // $id_module = (int) $_POST["id_module"];
        $name = trim($_POST["name"]);
        $teacher = trim($_POST["teacher"]);
        $modules = trim($_POST["modules"]);
        $ressources = trim($_POST["materials"]);
        $description = trim($_POST["description"]);
        $externressources = trim($_POST["externressources"]);
        
        $query = $db->query("insert into course 
            (`name`,`teacher`,`modules`,`materials`, `description`, `externressources`)
            values ('$name', '$teacher', '$modules','$ressources','$description','$externressources')"
        );
    
        header('Location: course.php');
        
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
    <div class="form__title">Add Course</div>
    <br><br>
    <p class="form__desc">
        Use this formular to fill out inforamtions
    </p>
    
    <br>
    <form class="form" action="" method="POST">
        <div class="form__item">
          <label for="atitel" class="form__label">Name</label>
          <input type="text" class="form__input"  id="atitel" name="name" placeholder="Enter the titel of the assigment" required>
          <span class="form__error">A sample error message</span>
        </div>
        <div class="form__item">
          <label for="adescription" class="form__label">Teacher</label>
          <input type="text" class="form__input"  id="atitel" name="teacher" placeholder="Enter the titel of the assigment" required>
        </div>
        <div class="form__item">
          <label for="amaterials" class="form__label">Modules</label>
          <textarea maxlength="500" class="form__input" id="amaterials" name="modules" placeholder="Modules"></textarea>
        </div>
        <div class="form__item">
          <label for="aressources" class="form__label">Materials</label>
          <textarea maxlength="500" class="form__input" id="aressources" name="materials" placeholder="Materials"></textarea>
        </div>
        <div class="form__item">
          <label for="aressources" class="form__label">Description</label>
          <textarea maxlength="500" class="form__input" id="aressources" name="description" placeholder="Materials"></textarea>
        </div>
        
        <div class="form__item">
          <label for="aressources" class="form__label">External Resources</label>
          <textarea maxlength="500" class="form__input" id="aressources" name="externressources" placeholder="External Resources"></textarea>
        </div>

        <div class="form__item">
          <button class="form__btn" type="submit">Save</button>
        </div>
      </div>
        
      </form>
  </div>
    
<?php include_once "footer.php" ?>
