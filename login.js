function validar(event) {
    event.preventDefault();
    let name = document.querySelector("#user").value

    let senha = document.querySelector("#password").value

    if (name =="" && senha == "") {        
        window.location.replace("../app/main.html");
      
    } else {
        alert("usuario não cadastrado")
        let name = document.querySelector("#user").value = ""

        let senha = document.querySelector("#password").value = ""
    }
}


