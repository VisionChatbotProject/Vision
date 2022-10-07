<?php 
    include_once "header.php";

    // $id = isset($_GET['del']);
    if($_SERVER["REQUEST_METHOD"] == "POST"){
        
        $intent_name= trim($_POST["intent_name"]);
        $intent_list= trim($_POST["intent_list"]);
        $response = trim($_POST["response"]);
           
        $query = $db->query("insert into intent
            ('intent_name','intent_list','response')
            values ('$intent_name','$intent_list','$response')"
        );
    
        header('Location: intent.php');
        
    }
?>
<div id="menubar">
        <ul id="menu">
          <!-- put class="selected" in the li tag for the selected page - to highlight which page you're on -->
          <li class="selected"><a href="index.html">Home</a></li>
          <li><a href="course.php">Course</a></li>
          <li><a href="chapter.php">Chapter</a></li>
          <li><a href="task.php">Tasks</a></li>
          <li><a href="exam.php">Exams</a></li>
          <li><a href="topic.php">Topics</a></li>
        </ul>
      </div>
    </div>
<div id="site_content">

    <div class="form__title">Add Intent</div>
    <br><br>
    <p class="form__desc">
        Use this formular to create new intents and responses
    </p>
    
    <br>
    <form class="form" action="" method="POST">
        <div class="form__item">
          <label for="iintent" class="form__label">Intent Name </label>
          <input type="text" class="form__input"  id="iintent" name="intent_name" placeholder="Enter a label for your intent example whoareyou" require>
          <span class="form__error">A sample error message</span>
        </div>
        <div class="form__item">
          <label for="iintent" class="form__label">Intent List </label>
          <textarea maxlength="500" class="form__input" id="iintent" name="intent_list" placeholder="Enter intents, begin new intent with - example - who are you? \n - are you a bot?" require></textarea>
          <span class="form__error">A sample error message</span>
        </div>
	<div class="form__item">
          <label for="iintent" class="form__label">Response</label>
          <input type="text" class="form__input"  id="iresponse" name="response" placeholder="Enter a response for your intents" require>
          <span class="form__error">A sample error message</span>
        </div>
	 <div class="form__item">
          <button class="form__btn" type="submit">Register intent</button>
        </div>
      </div>
        
      </form>
    </div>
<?php include_once "footer.php" ?>
