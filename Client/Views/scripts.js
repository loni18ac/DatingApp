// Create a very simple class
class User {
    constructor(firstname, lastname, birthday, gender,email, password){
        this.firstName = firstname;
        this.lastname = lastname;
        this.gender = gender;
        this.birthday = birthday;
        this.email = email;
        this.password = password;
    }
}

// Construct the object
//const henrik = new User("Henrik", "Thorn", "100185", "male", "ht.digi@cbs.dk", "qwerty");

// We only want to do something when the dom is loaded
document.addEventListener("DOMContentLoaded", function() {
    // Find the table
    let table = document.getElementById("personProfile");
    let html = "";

    // Get all the keys in our object
    let objectKeys = Object.keys(henrik);

    // Loop through the keys in our array
    for (let objectKey of objectKeys) {
        // Construct the needed HTML for the table
        html += "<tr><td>" + objectKey + "</td><td>" + henrik[objectKey] + "</td></tr>";
    }

    // Set the table with the updated HTML
    table.innerHTML = html;

    let password = document.getElementById("password");
    password.addEventListener("keyup", function(){
        let password = document.getElementById("password").value;
        let errorText = "";

        if(password == "" || password.length < 6){
            errorText += "Please submit password that is at least six chars \n";
        }

        if(errorText != ""){
            document.getElementById("message").innerText = errorText;
        }else {
            document.getElementById("message").innerText = "Password is valid";
        }


    });

    // Find the buttom in the DOM
    let button = document.getElementById("submit");
    
    // We add an event listener
    button.addEventListener("click", function(){
        let errorText = "";
        let firstname = document.getElementById("firstname").value;
        let lastname = document.getElementById("lastname").value;
        let email = document.getElementById("email").value;
        let birthday = document.getElementById("birthday").value;
        let gender = document.getElementById("gender").value;
        let password = document.getElementById("password").value;
        
        const regExForEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        

        if(firstname == ""){
            errorText += "Fistname is empty\n";            
        }
        if(lastname == ""){
            errorText += "Fistname is empty\n";            
        }
        if(regExForEmail.test(String(email).toLowerCase())){
            errorText += "Email is not valid\n";
        }
        if(birthday == "" && birthday.length != 8) {
            errorText += "Birthday is not valid or not in valid format\n";
        }
        if(gender == "" || (gender != "male" || gender != "female")){
            errorText += "You need to input a valid gender. Either female or male\n";
        }
        if(password == "" || password.length < 6){
            errorText += "Please submit password that is at least six chars \n";
        }
        
        // If we have errors we output them
        if(errorText != ""){
            document.getElementById("message").innerText = errorText;
        }else {
            let newUser = new User(firstname, lastname, birthday, gender, email, password);
        }
    });


    let apiButton = document.getElementById("apiButton");
    apiButton.addEventListener("click", function(){
        var xhttp = new XMLHttpRequest();
        //betyder når readystate skifter, sker der noget
        xhttp.onreadystatechange = function() {
            //4 er done, https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
            //status 200 er ok, alt gik fint
            if (this.readyState == 4 && this.status == 200) {
                // Typical action to be performed when the document is ready:
                //når man får svar fra serveren. 
                alert(xhttp.responseText);
            }
        };
        xhttp.open("GET", "http://localhost:4000", true);
        xhttp.send();
    });
});

function uploadfile(){
var xhttp = new XMLHttpRequest();
var file = document.getElementById('file')
//Vi finder den file, som er under file.files[0], i HTML er den måde en fil bliver gemt
//når man går brug af input tagget med type file. Se her https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
    var myfile = file.files[0]
    //Vi gør brug af FormData, da den encoder vores data, til en bestemt type som hedder "multipart/form-data" https://developer.mozilla.org/en-US/docs/Web/API/FormData
    //Denne type kan vi sende
    var formData = new FormData()
    //Her sætter vi key value pair i formen til file: Myfile
    //Så nøglen file, bliver lig den fil, som vi har uploadet
    //Via append, bliver den en del af FormData se dokumentation linje 127. 
    formData.append('file', myfile)

    //Her laves en request, man "initializer" den. Vi forklare vores Request hvilken slags den er og hvor den skal hen. 
    //True betyder det er en asynkron request vi laver. skal være true når der bruges multipart. 
    xhttp.open("POST", "http://localhost:4000/upload", true); 
    //Sender den request vi har defineret lige over. https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/send
    xhttp.send(formData); 
    //betyder når readystate skifter, sker der noget
xhttp.onreadystatechange = function() {
    
    //4 er done, https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
    //status 200 er ok, alt gik fint
    if (this.readyState == 4 && this.status == 200) {
        // Typical action to be performed when the document is ready:
        //når man får svar fra serveren. 
        console.log(xhttp.responseText)   
    }
};

}