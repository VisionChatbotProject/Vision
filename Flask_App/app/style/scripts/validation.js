// document.getElementById("myBtn").addEventListener("click", myFunction);
// function myFunction() {
//     let container = document.getElementById("input_field");
//
//     let input_field = document.createElement("div");
//     input_field.style.display = "flex"
//     input_field.style.width = "100%"
//     input_field.style.alignItems = "center"
//
//     let label = document.createElement("label");
//     label.style.width = "30px"
//     label.style.fontSize = "20px"
//
//     let input = document.createElement("input");
//     input.type = "text";
//     input.name = "intent_list[]";
//     input.classList.add("form__input")
//
//     input_field.appendChild(label);
//     input_field.appendChild(input);
//
//     container.appendChild(input_field)
//     container.appendChild(document.createElement("br"));
// }

// Global variables
let form = document.getElementById("input_field");;
let errorSpan = document.querySelector("form button")


function addField(element) {
    // Check if there is text in the input field
    if(element.previousElementSibling.value.trim()===""){
        return false;
    }

    let div = document.createElement("div");
    div.setAttribute("class", "field");

    let field = document.createElement("input");
    field.setAttribute("type", "text");
    field.setAttribute("name", "intent_list[]");
    field.setAttribute("required", "true")
    field.classList.add("intents")

    let add_btn = document.createElement("span");
    add_btn.setAttribute("onclick", "addField(this)");
    let plus = document.createTextNode("+");
    add_btn.appendChild(plus)

    let delete_btn = document.createElement("span");
    delete_btn.setAttribute("onclick", "removeField(this)");
    let minus = document.createTextNode("-");
    delete_btn.appendChild(minus)

    form.appendChild(div)
    div.appendChild(field)
    div.appendChild(add_btn)
    div.appendChild(delete_btn)

    element.nextElementSibling.style.display = "block"

    element.style.display = "none"
}

function removeField(element) {
    element.parentElement.remove()
}

function validateForm(){
    let inputField = document.getElementsByTagName('input');
    let error_submit = document.getElementById("error_submit")
    if(inputField.length <= 3) {
        error_submit.textContent = "Please enter at least two intents by clicking the + button"
        return false;
    }

    // Get input fields
    let inputFields = document.getElementsByClassName("intents")

    // Iterate the intents and add - before the intents
    for(let i = 0; i < inputFields.length; i++) {
        inputFields[i].value = "- " + inputFields[i].value
    }
    return true
}