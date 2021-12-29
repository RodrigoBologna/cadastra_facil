
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient)) 

 const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push (client)
    setLocalStorage(dbClient)
}

const readClient = () => getLocalStorage()
    
const updateClient = (index, client) => {
    const dbClient = readClient();
    dbClient[index] = client;
    setLocalStorage(dbClient);
    
}

const deleteClient = (index) => {
    const dbClient = readClient();
    dbClient.splice(index,1)
    setLocalStorage(dbClient);
}
const isValidFields = () => {
   return document.getElementById('cadastroRegistro').reportValidity()

}
const saveClient = () => {
    if (isValidFields()) {
        const client = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            cpf: document.getElementById('cpf').value,
            cep: document.getElementById('cep').value,
            rua: document.getElementById('rua').value,
            numero: document.getElementById('numero').value,
            bairro: document.getElementById('bairro').value,
            cidade: document.getElementById('cidade').value,
        }
        const index = document.getElementById('name').dataset.index
        if (index == 'new') {
            createClient(client)
            updateTable()

        } else {
            updateClient(index, client)
            updateTable()

        }



    }
}

const createRow = (client, index) => {
    const newRow = document.createElement("tr")
    newRow.innerHTML = `
    <td>${client.name}</td>
    <td>${client.phone}</td>
    <td>${client.email}</td>
    <td>${client.cpf.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")}</td>
    <td>${client.cep}</td>
    <td>${client.rua}</td>
    <td>${client.numero}</td>
    <td>${client.bairro}</td>
    <td>${client.cidade}</td>
    <td>
        <a href="#container"><button type="button" class="button_green" id="edit-${index}">Editar</button></a>
        <button type="button" class="button_red" id="delete-${index}" >Excluir</button>
    </td>       
        `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(createRow)
}


const fillFields = (client) => {
    document.getElementById('name').value = client.name
    document.getElementById('phone').value = client.phone
    document.getElementById('email').value = client.email
    document.getElementById('cpf').value = client.cpf
    document.getElementById('cep').value = client.cep
    document.getElementById('rua').value = client.rua
    document.getElementById('numero').value = client.numero
    document.getElementById('bairro').value = client.bairro
    document.getElementById('cidade').value = client.cidade
    document.getElementById('name').dataset.index = client.index
    
}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editClient(index)
        } else {
            const client = readClient()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${client.name}`)
            if (response) {
                deleteClient(index)
                updateTable()
            }
        }
    }
}

updateTable()


function limpa_formulário_cep() {
    //Limpa valores do formulário de cep.
    document.getElementById("name").value=("");
    document.getElementById("phone").value=("");
    document.getElementById("email").value=("");
    document.getElementById("cpf").value=("");
    document.getElementById('rua').value=("");
    document.getElementById('bairro').value=("");
    document.getElementById('cidade').value=("");
  
}

function meu_callback(conteudo) {
if (!("erro" in conteudo)) {
    //Atualiza os campos com os valores.
    document.getElementById('rua').value=(conteudo.logradouro);
    document.getElementById('bairro').value=(conteudo.bairro);
    document.getElementById('cidade').value=(conteudo.localidade);

} //end if.
else {
    //CEP não Encontrado.
    limpa_formulário_cep();
    alert("CEP não encontrado.");
}
}

function pesquisacep(valor) {

//Nova variável "cep" somente com dígitos.
var cep = valor.replace(/\D/g, '');

//Verifica se campo cep possui valor informado.
if (cep != "") {

    //Expressão regular para validar o CEP.
    var validacep = /^[0-9]{8}$/;

    //Valida o formato do CEP.
    if(validacep.test(cep)) {

        //Preenche os campos com "..." enquanto consulta webservice.
        document.getElementById('rua').value="...";
        document.getElementById('bairro').value="...";
        document.getElementById('cidade').value="...";
    

        //Cria um elemento javascript.
        var script = document.createElement('script');

        //Sincroniza com o callback.
        script.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=meu_callback';

        //Insere script no documento e carrega o conteúdo.
        document.body.appendChild(script);

    } //end if.
    else {
        //cep é inválido.
        limpa_formulário_cep();
        alert("Formato de CEP inválido.");
    }
} //end if.
else {
    //cep sem valor, limpa formulário.
    limpa_formulário_cep();
}
}

const input = document.getElementById('search');
const trs = [...document.querySelectorAll('#tableClient tbody tr')];

input.addEventListener('input', () => {
  const search = input.value.toLowerCase();
  trs.forEach(el => {
    const matches = el.textContent.toLowerCase().includes(search);
    el.style.display = matches ? 'table-row' : 'none';
  });
});

function cpf_mask(){
    let cpf = document.getElementById('cpf')
        if(cpf.value.length === 3 || cpf.value.length === 7){
            cpf.value += "."
        }else if(cpf.value.length == 11){
            cpf.value += "-"
        }
} 
function mask(o, f) {
    setTimeout(function() {
      var v = mphone(o.value);
      if (v != o.value) {
        o.value = v;
      }
    }, 1);
  }
  
  function mphone(v) {
    var r = v.replace(/\D/g, "");
    r = r.replace(/^0/, "");
    if (r.length > 10) {
      r = r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (r.length > 5) {
      r = r.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (r.length > 2) {
      r = r.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
    } else {
      r = r.replace(/^(\d*)/, "($1");
    }
    return r;
  }

  function _cpf(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
    if (cpf.length != 11 ||
    cpf == "00000000000" ||
    cpf == "11111111111" ||
    cpf == "22222222222" ||
    cpf == "33333333333" ||
    cpf == "44444444444" ||
    cpf == "55555555555" ||
    cpf == "66666666666" ||
    cpf == "77777777777" ||
    cpf == "88888888888" ||
    cpf == "99999999999")
    return false;
    add = 0;
    for (i = 0; i < 9; i++)
    add += parseInt(cpf.charAt(i)) * (10 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
    rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
    return false;
    add = 0;
    for (i = 0; i < 10; i++)
    add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
    rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
    return false;
    return true;
    }

    function validarCPF(el){
        if( !_cpf(el.value) ){
        alert("CPF inválido!" + el.value);
        // apaga o valor
        el.value = "";
        }
        }
 




document.querySelector('#tableClient>tbody').addEventListener('click', editDelete)