<?php 
    include_once "header.php";

    // $id = isset($_GET['del']);
    if($_SERVER["REQUEST_METHOD"] == "POST"){
        echo "<h1>It gets here<p>";
        $topic= trim($_POST["topic"]);
        $meaning = trim($_POST["meaning"]);
        $information = trim($_POST["information"]);
           
        $query = $db->query("insert into topic
            ('topic','meaning','information')
            values ('$topic','$meaning','$information')"
        );
    
        header('Location: topic.php');
        
    }
?>
<div id="menubar">
        <ul id="menu">
          <!-- put class="selected" in the li tag for the selected page - to highlight which page you're on -->
          <li><a href="index.html">Home</a></li>
          <li><a href="course.php">Course</a></li>
          <li><a href="chapter.php">Chapter</a></li>
          <li><a href="task.php">Tasks</a></li>
          <li><a href="exam.php">Exams</a></li>
          <li  class="selected"><a href="topic.php">Topics</a></li>
        </ul>
      </div>
    </div>
<div id="site_content">

    <div class="form__title">Add topic</div>
    <br><br>
    <p class="form__desc">
        Use this formular to fill out information about the topic
    </p>
    
    <br>
    <form class="form" action="" method="POST">
        <div class="form__item">
          <label for="ttopic" class="form__label">Topic</label>
          <input type="text" class="form__input"  id="ttopic" name="topic" placeholder="Enter topic" require>
          <span class="form__error">A sample error message</span>
        </div>
        <div class="form__item">
          <label for="tmeaning" class="form__label">Meaning</label>
          <textarea maxlength="500" class="form__input" id="tmeaning" name="meaning" placeholder="Meaning of topic" require></textarea>
          <span class="form__error">A sample error message</span>
        </div>
        <div class="form__item">
          <label for="tinformation" class="form__label">Information</label>
          <textarea maxlength="500" class="form__input" id="tinformation" name="information" placeholder="Additional information about the topic example: http://references.pdf"></textarea>
          <span class="form__error">A sample error message</span>
        </div>
        <div class="form__item">
          <button class="form__btn" type="submit">Register task</button>
        </div>
      </div>
        
      </form>
    </div>
<?php include_once "footer.php" ?>
