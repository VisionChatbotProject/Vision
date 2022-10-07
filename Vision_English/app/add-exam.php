<?php 
    include_once "header.php";

    // $id = isset($_GET['del']);
    if($_SERVER["REQUEST_METHOD"] == "POST"){
        
        // $id_module = (int) $_POST["id_module"];
        $name = trim($_POST["name"]);
        $id_course = trim($_POST["id_course"]);
        $record = trim($_POST["record"]);
        $description = trim($_POST["description"]);
        $observations = trim($_POST["observations"]);
        $exam_date = $_POST["exam_date"];
        
        $query = $db->query("insert into exams 
            (`name`,`id_course`,`record`,`observations`, `description`, `exam_date`)
            values ('$name', '$id_course', '$record','$observations','$description','$exam_date')"
        );
    
        header('Location: exam.php');
        
    }
?>


    <div class="form__title">Add Exam</div>
    <br><br>
    <p class="form__desc">
        Use this formular to fill out inforamtions
    </p>
    
    <br>
    <form class="form" action="" method="POST">
        <div class="form__item">
          <label for="atitel" class="form__label">Course</label>
          <select name="id_module" class="form__input" >
                <option value="">Choose one</option>
                
                <?php foreach($courses as $row): ?>
                    <option value="<?= $row['id_course'] ?>"><?= $row['name'] ?></option>
                <?php endforeach ?>
            </select>
        </div>
        <div class="form__item">
          <label for="adescription" class="form__label">Name</label>
          <input type="text" class="form__input"  id="atitel" name="name" placeholder="Enter the Name" required>
        </div>
        <div class="form__item">
          <label for="aressources" class="form__label">Record</label>
          <input type="text" class="form__input"  id="atitel" name="record" placeholder="Enter the record" required>
        </div>
        <div class="form__item">
          <label for="aressources" class="form__label">Description</label>
          <textarea maxlength="500" class="form__input" id="aressources" name="description" placeholder="Description"></textarea>
        </div>
        <div class="form__item">
          <label for="aressources" class="form__label">Observations</label>
          <input type="text" class="form__input"  id="atitel" name="observations" placeholder="Enter the Observations" required>
        </div>
        
        <div class="form__item">
          <label for="aressources" class="form__label">Exam Date</label>
          <input type="date" class="form__input form__input--small" id="adeadline" name="exam_date" placeholder="Enter a deadline for the assigment" require>

        </div>

        <div class="form__item">
          <button class="form__btn" type="submit">Save</button>
        </div>
      </div>
        
      </form>
    
<?php include_once "footer.php" ?>
