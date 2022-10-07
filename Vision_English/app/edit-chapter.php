<?php 
    include_once "header.php";

    if(isset($_GET['edit'])){
        $single = $db->query("select * from chapter where id_chapter=".$_GET['edit']);
        $single = $single->fetch();
    }   


    
    if($_SERVER["REQUEST_METHOD"] == "POST"){
        
        // $id_chapter = (int) $_POST["id_chapter"];
        $id = $_POST["id"];
        $name_chapter = trim($_POST["name_chapter"]);
        $short_description = trim($_POST["short_description"]);
        $content = trim($_POST["content"]);
        $key_concepts = trim($_POST["key_concepts"]);
        $ressources = trim($_POST["ressources"]);
        $observations = trim($_POST["observations"]);
       
        $query = $db->query("update chapter set
            name_chapter = '$name_chapter',
            short_description = '$short_description',
            content = '$content',
            key_concepts = '$key_concepts',
            ressources = '$ressources',
	    observations = '$observations'
            where id_chapter='$id'"                
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
    <div class="form__title">Edit Chapter</div>
    <br><br>
    <p class="form__desc">
        Use this formular to update the information about the chapters
    </p>
    
    <br>
    <form class="form" action="" method="POST">
    <input type="hidden" value="<?= $single['id_chapter']?>" name="id" >
        <div class="form__item">
          <label for="cname" class="form__label">Name</label>
          <input type="text" class="form__input"  id="cname" name="name_chapter" value="<?= $single['name_chapter'] ?>"  placeholder="Enter the Name" required>
        </div>

	 <div class="form__item">
          <label for="cdescription" class="form__label">Description</label>
          <textarea maxlength="500" class="form__input" id="cdescription" name="short_description" placeholder="Description"><?= $single['short_description'] ?></textarea>
        </div>
	 <div class="form__item">
          <label for="ccontent" class="form__label">Content</label>
          <textarea maxlength="500" class="form__input" id="ccontent" name="content" placeholder="Please insert the content (Subtitles)(Submodules)"><?= $single['content'] ?></textarea>
        </div>
	 <div class="form__item">
         <label for="ckey_concepts" class="form__label">Key concepts / Key words</label>
          <textarea maxlength="500" class="form__input" id="akey_concepts" name="key_concepts" placeholder="Please insert the key concepts, key words for the chapter"><?= $single['key_concepts'] ?></textarea>
        </div>	
	<div class="form__item">
         <label for="cressources" class="form__label">Ressources and Materials / Key words</label>
          <textarea maxlength="500" class="form__input" id="cressources" name="ressources" placeholder="Please insert the materials and ressources needed for the chapter"><?= $single['ressources'] ?></textarea>
        </div>	

	<div class="form__item">
         <label for="cobservations" class="form__label">Observations / Extra Information of the teacher for the students </label>
          <textarea maxlength="500" class="form__input" id="cressources" name="observations" placeholder="Please insert extra information needed to be provided"><?= $single['observations'] ?></textarea>
        </div>	
	<div class="form__item">
          <button class="form__btn" type="submit">Save</button>
        </div>
      </div>
        
      </form>
</div>
    
<?php include_once "footer.php" ?>
