function freeze_button(){
    document.getElementById("submit_btn").disabled = true;
    setTimeout(function(){document.getElementById("submit_btn").disabled = false;},60000);
}