<?php 
    include_once "header.php";

    // $id = isset($_GET['del']);
    if($_SERVER["REQUEST_METHOD"] == "POST"){
        
        // $id_chapter = (int) $_POST["id_chapter"];
        $name_chapter = trim($_POST["name_chapter"]);
	$short_description = trim($_POST["short_description"]);
        $content = trim($_POST["content"]);
        $key_concepts = trim($_POST["key_concepts"]);
        $ressources = $_POST["ressources"];
        $observations= trim($_POST["observations"]);
        
        $query = $db->query("insert into chapter 
            ('name_chapter','short_description','content', 'key_concepts', 'ressources','observations')
            values ('$name_chapter', '$short_description', '$content','$key_concepts','$ressources','$observations')"
        );
    
        header('Location: chapter.php');
        
    }
?>

<div id="menubar">
        <ul id="menu">
          <!-- put class="selected" in the li tag for the selected page - to highlight which page you're on -->
          <li><a href="index.html">Home</a></li>
          <li><a href="course.php">Course</a></li>
          <li class="selected"><a href="chapter.php">Chapters</a></li>
          <li><a href="task.php">Tasks</a></li>
          <li><a href="exam.php">Exams</a></li>
          <li><a href="topic.php">Topics</a></li>
        </ul>
      </div>

  <div id="site_content">

    <div class="form__title">Add chapter</div>
    <br><br>
    <p class="form__desc">
        Use this formular to add a new chapter
    </p>
    
    <br>
    <form class="form" action="" method="POST">
        <div class="form__item">
          <label for="cname" class="form__label">Name</label>
          <input type="text" class="form__input"  id="cname" name="name_chapter" placeholder="Enter the Name" required>
        </div>

	<div class="form__item">
          <label for="cdescription" class="form__label">Description</label>
          <textarea maxlength="500" class="form__input" id="cdescription" name="short_description" placeholder="Description"></textarea>
        </div>
	 <div class="form__item">
          <label for="ccontent" class="form__label">Content</label>
          <textarea maxlength="500" class="form__input" id="ccontent" name="content" placeholder="Please insert the content (Subtitles)(Submodules)"></textarea>
        </div>
	 <div class="form__item">
         <label for="ckey_concepts" class="form__label">Key concepts / Key words</label>
          <textarea maxlength="500" class="form__input" id="akey_concepts" name="key_concepts" placeholder="Please insert the key concepts, key words for the chapter"></textarea>
        </div>	
	<div class="form__item">
         <label for="cressources" class="form__label">Ressources and Materials / Key words</label>
          <textarea maxlength="500" class="form__input" id="cressources" name="ressources" placeholder="Please insert the materials and ressources needed for the chapter"></textarea>
        </div>	

	<div class="form__item">
         <label for="cobservations" class="form__label">Observations / Extra Information of the teacher for the students </label>
          <textarea maxlength="500" class="form__input" id="cressources" name="observations" placeholder="Please insert extra information needed to be provided"></textarea>
        </div>	
        <div class="form__item">
          <button class="form__btn" type="submit">Save</button>
        </div>
      </div>
        
      </form>
  </div>
    
<?php include_once "footer.php" ?>
