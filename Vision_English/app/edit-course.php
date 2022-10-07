<?php 
    include_once "header.php";
    if(isset($_GET['edit'])){
        $single = $db->query("select * from course where id_course=".$_GET['edit']);
        $single = $single->fetch();
    }   

    if($_SERVER["REQUEST_METHOD"] == "POST"){
        
        $id=$_POST["id"];
        $name = trim($_POST["name"]);
        $teacher = trim($_POST["teacher"]);
        $email_teacher = trim($_POST["email_teacher"]);
        $chapters = trim($_POST["chapters"]);
        $description = trim($_POST["description"]);
        $materials = trim($_POST["materials"]);
        $externressources = trim($_POST["externressources"]);
        
        $query = $db->query("update course set 
            name='$name',
            teacher='$teacher',
            email_teacher='$email_teacher',
            chapters='$chapters',
            description='$description',
            materials='$materials',
            externressources='$externressources' where id_course='$id'"
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
    <div class="form__title">Update Course</div>
    <br><br>
    <p class="form__desc">
        User this formular to update the information of the course
    </p>
      <br>
     
      <form class="form" action="" method="POST">
    <input type="hidden" value="<?= $single['id_course']?>" name="id" >

        <div class="form__item">
          <label for="aname" class="form__label">Name</label>
          <input type="text" class="form__input"  id="aname" name="name" value="<?= $single['name'] ?>" placeholder="Enter the titel of the assigment" required>
          <span class="form__error">A sample error message</span>
        </div>
        <div class="form__item">
          <label for="adescription" class="form__label">Teacher</label>
          <input type="text" class="form__input"  id="ateacher" name="teacher" value="<?= $single['teacher'] ?>" placeholder="Enter the titel of the assigment" required>
        </div>
        <div class="form__item">
          <label for="aemailteacher" class="form__label">E-Mail Teacher</label>
          <input type="text" class="form__input"  id="aemailteacher" name="email_teacher" value="<?= $single['email_teacher'] ?>" placeholder="Enter the titel of the assigment" required>
        </div>
        <div class="form__item">
          <label for="achapters" class="form__label">Chapters</label>
          <textarea maxlength="500" class="form__input" id="achapters" name="chapters" placeholder="List of chapters"><?= $single['chapters'] ?></textarea>
        </div>

        <div class="form__item">
          <label for="adescription" class="form__label">Description</label>
          <textarea maxlength="500" class="form__input" id="adescription" name="description" placeholder="Description of the course"><?= $single['description'] ?></textarea>
        </div>
        <div class="form__item">
          <label for="amaterials" class="form__label">Materials</label>
          <textarea maxlength="500" class="form__input" id="amaterials" name="materials" placeholder="Books, Literature, Materials needed for the course"><?= $single['materials'] ?></textarea>
        </div>
        <div class="form__item">
          <label for="aextressources" class="form__label">Extern Ressourcers</label>
          <textarea maxlength="500" class="form__input" id="aextressources" name="externressources" placeholder="Extern Ressources"><?= $single['externressources'] ?></textarea>
        </div>
       <div class="form__item">
          <button class="form__btn" type="submit">Save</button>
        </div>
      </div>

      </form>
          
</body>
</html>
<?php include_once "footer.php" ?>
