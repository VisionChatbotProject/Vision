<?php 
    include_once "header.php";

    if(isset($_GET['del'])){
        $db->query("delete from exams where id_exam=".$_GET['del']);
        header("Refresh:0; url=exam.php");
    }   

?>

    <div class="form__title">Exam</div>
    <a href="add-exam.php" class="btn-add">Add new Course</a>  
    
    <table>
        <tr>
            <th>Name</th>
            <th>Course</th>
            <th>Description</th>
            <th>Record</th>
            <th>observations</th>
            <th>Exam Date</th>
            <th>#</th>
        </tr>
            <?php                 
            foreach($exams as $row):
            ?>
                <tr>
                    <td><?= $row['name'] ?></td>
                    <td><?= $row['course_name'] ?></td>
                    <td><?= $row['description'] ?></td>
                    <td><?= $row['record'] ?></td>
                    <td><?= $row['observations'] ?></td>
                    <td><?= $row['exam_date'] ?></td>
                    <td>
                        <a href="edit-exam.php?edit=<?= $row['id_exam'] ?>" class="btn-edit">Edit</a>
                        | 
                        <a href="exam.php?del=<?= $row['id_exam'] ?>" class="btn-edit">Delete</a>
                    </td>
                </tr>
            <?php endforeach ?>
    </table>

<?php include_once "footer.php" ?>
