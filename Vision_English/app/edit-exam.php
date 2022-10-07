<?php 
    include_once "header.php";

    if(isset($_GET['edit'])){
        $single = $db->query("select * from exams where id_exam=".$_GET['edit']);
        $single = $single->fetch();
    }   


    
    if($_SERVER["REQUEST_METHOD"] == "POST"){
        
        // $id_module = (int) $_POST["id_module"];
        $id = $_POST["id"];
        $name = trim($_POST["name"]);
        $id_course = trim($_POST["id_course"]);
        $record = trim($_POST["record"]);
        $description = trim($_POST["description"]);
        $observations = trim($_POST["observations"]);
        $exam_date = $_POST["exam_date"];
        
        $query = $db->query("update exams set
            name = '$name',
            id_course = '$id_course',
            record = '$record',
            observations = '$observations',
            description = '$description',
            exam_date = '$exam_date'
            where id_exam='$id'"                
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
    <input type="hidden" value="<?= $single['id_exam']?>" name="id" >

        <div class="form__item">
          <label for="atitel" class="form__label">Course</label>
          <select name="id_course" class="form__input" >
                <option value="">Choose one</option>
                
                <?php foreach($courses as $row): ?>
                    <option value="<?= $row['id_course'] ?>"
                    <?php if($single['id_course'] == $row['id_course']) echo 'selected'; ?>><?= $row['name'] ?></option>
                <?php endforeach ?>
            </select>
        </div>
        <div class="form__item">
          <label for="adescription" class="form__label">Name</label>
          <input type="text" class="form__input"  id="atitel" name="name" value="<?= $single['name'] ?>"  placeholder="Enter the Name" required>
        </div>
        <div class="form__item">
          <label for="aressources" class="form__label">Record</label>
          <input type="text" class="form__input"  id="atitel" name="record" value="<?= $single['record'] ?>" placeholder="Enter the record" required>
        </div>
        <div class="form__item">
          <label for="aressources" class="form__label">Description</label>
          <textarea maxlength="500" class="form__input" id="aressources" name="description" placeholder="Description"><?= $single['description'] ?></textarea>
        </div>
        <div class="form__item">
          <label for="aressources" class="form__label">Observations</label>
          <input type="text" class="form__input"  id="atitel" name="observations" value="<?= $single['observations'] ?>" placeholder="Enter the Observations" required>
        </div>
        
        <div class="form__item">
          <label for="aressources" class="form__label">Exam Date</label>
          <input type="date" class="form__input form__input--small" id="adeadline" value="<?= $single['exam_date'] ?>" name="exam_date" placeholder="Enter a deadline for the assigment" require>

        </div>

        <div class="form__item">
          <button class="form__btn" type="submit">Save</button>
        </div>
      </div>
        
      </form>
    
<?php include_once "footer.php" ?>
