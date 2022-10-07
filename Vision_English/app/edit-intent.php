<?php 
    include_once "header.php";

    if(isset($_GET['edit'])){
        $single = $db->query("select * from intent where id_intent=".$_GET['edit']);
        $single = $single->fetch();
    }   

    if($_SERVER["REQUEST_METHOD"] == "POST"){
        
        
        $id_intent=$_POST["id_intent"];
        $intent_name = trim($_POST["intent_name"]);
        $intent_list = trim($_POST["intent_list"]);
        $response = trim($_POST["response"]);
       
        
        $q = $db->query("update intent set 
        intent_name='$intent_name',
        intent_list='$intent_list',
        response='$response'
        where id_intent='$id_intent'");
       	header('Location: intent.php');
        
    }
?>

 <div id="menubar">
        <ul id="menu">
          <!-- put class="selected" in the li tag for the selected page - to highlight which page you're on -->
          <li  class="selected"><a href="index.html">Home</a></li>
          <li><a href="course.php">Course</a></li>
          <li><a href="chapter.php">Chapters</a></li>
          <li><a href="intent.php">intents</a></li>
          <li><a href="exam.php">Exams</a></li>
          <li><a href="topic.php">Topics</a></li>
        </ul>
      </div>
    </div>

<div id="site_content">
    <div class="form__title">Edit intents</div>
    <br><br>
    <p class="form__desc">
        Use this formular to update data about the intents
    </p>
    
    <br>
    <form class="form" action="" method="POST">
        <input type="hidden" value="<?= $single['id_intent']?>" name="id_intent" >

	<div class="form__item">
          <label for="iintent" class="form__label">Intent Name </label>
          <input type="text" class="form__input"  id="iintent" name="intent_name" value="<?= $single['intent_name'] ?>" placeholder="Enter a label for your intent example whoareyou" require>
          <span class="form__error">A sample error message</span>
        </div>
        <div class="form__item">
          <label for="iintent" class="form__label">Intent List </label>
          <textarea maxlength="500" class="form__input" id="iintent" name="intent_list" placeholder="Enter intents, begin new intent with - example - who are you? \n - are you a bot?" require><?= $single['intent_list'] ?></textarea>
          <span class="form__error">A sample error message</span>
        </div>
	<div class="form__item">
          <label for="iintent" class="form__label">Response</label>
          <input type="text" class="form__input"  id="iresponse" name="response" placeholder="Enter a response for your intents" require value="<?= $single['response'] ?>" >
          <span class="form__error">A sample error message</span>
        </div>
	 <div class="form__item">
          <button class="form__btn" type="submit">Update intent</button>
        </div>
        
      </form>
</div>
    
<?php include_once "footer.php" ?>
