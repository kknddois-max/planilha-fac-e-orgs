const setores = [
'orgs',
'municao',
'desmanche',
'meta',
'lavagem',
'baseado',
'coca',
'airsoft'
];

let membros =
JSON.parse(localStorage.getItem('membros')) || [];

let historico =
JSON.parse(localStorage.getItem('historico')) || [];

let editando = null;

/* NAVEGAÇÃO */

function showPage(id){

document
.querySelectorAll('.page')
.forEach(page=>{
page.classList.remove('active');
});

document
.getElementById(id)
.classList.add('active');

renderTable(id);
updateDashboard();
}

/* SALVAR */

function saveStorage(){

localStorage.setItem(
'membros',
JSON.stringify(membros)
);

localStorage.setItem(
'historico',
JSON.stringify(historico)
);

}

/* DASHBOARD */

function updateDashboard(){

document.getElementById('count-orgs').innerText =
membros.filter(x=>x.setor==='orgs').length;

document.getElementById('count-municao').innerText =
membros.filter(x=>x.setor==='municao').length;

document.getElementById('count-desmanche').innerText =
membros.filter(x=>x.setor==='desmanche').length;

document.getElementById('count-meta').innerText =
membros.filter(x=>x.setor==='meta').length;

document.getElementById('count-lavagem').innerText =
membros.filter(x=>x.setor==='lavagem').length;

document.getElementById('count-baseado').innerText =
membros.filter(x=>x.setor==='baseado').length;

document.getElementById('count-coca').innerText =
membros.filter(x=>x.setor==='coca').length;

document.getElementById('count-airsoft').innerText =
membros.filter(x=>x.setor==='airsoft').length;

}

/* ADICIONAR / EDITAR */

function saveMember(setor){

const nome =
document.getElementById(`nome-${setor}`).value.trim();

const id =
document.getElementById(`id-${setor}`).value.trim();

const cargo =
document.getElementById(`cargo-${setor}`).value;

if(!nome || !id){

alert('Preencha todos os campos.');

return;

}

if(editando !== null){

membros[editando] = {
...membros[editando],
nome,
id,
cargo
};

historico.unshift({
data:new Date().toLocaleString(),
acao:`✏️ ${nome} foi editado em ${setor}`
});

editando = null;

}else{

membros.push({
setor,
nome,
id,
cargo
});

historico.unshift({
data:new Date().toLocaleString(),
acao:`➕ ${nome} adicionado em ${setor}`
});

}

document.getElementById(
`nome-${setor}`
).value = '';

document.getElementById(
`id-${setor}`
).value = '';

saveStorage();

renderTable(setor);

updateDashboard();

renderHistory();

}

/* LISTAR */

function renderTable(setor){

const tabela =
document.getElementById(
`table-${setor}`
);

if(!tabela) return;

const buscaInput =
document.getElementById(
`search-${setor}`
);

const busca =
buscaInput
? buscaInput.value.toLowerCase()
: '';

tabela.innerHTML = '';

membros
.filter(m=>m.setor===setor)
.filter(m=>

m.nome.toLowerCase().includes(busca)

||

m.id.toString().includes(busca)

)
.forEach((membro,index)=>{

tabela.innerHTML += `

<tr>

<td>${membro.nome}</td>

<td>${membro.id}</td>

<td>${membro.cargo}</td>

<td>

<button
class="edit-btn"
onclick="editMember('${setor}',${index})">

Editar

</button>

<button
class="delete-btn"
onclick="deleteMember('${setor}',${index})">

Excluir

</button>

</td>

</tr>

`;

});

}

/* EDITAR */

function editMember(setor,index){

const lista =
membros.filter(
x=>x.setor===setor
);

const membro =
lista[index];

const realIndex =
membros.findIndex(x=>

x.setor===membro.setor &&
x.nome===membro.nome &&
x.id===membro.id

);

editando = realIndex;

document.getElementById(
`nome-${setor}`
).value = membro.nome;

document.getElementById(
`id-${setor}`
).value = membro.id;

document.getElementById(
`cargo-${setor}`
).value = membro.cargo;

window.scrollTo({
top:0,
behavior:'smooth'
});

}

/* EXCLUIR */

function deleteMember(setor,index){

const lista =
membros.filter(
x=>x.setor===setor
);

const membro =
lista[index];

if(
!confirm(
`Excluir ${membro.nome}?`
)
){
return;
}

const realIndex =
membros.findIndex(x=>

x.setor===membro.setor &&
x.nome===membro.nome &&
x.id===membro.id

);

historico.unshift({

data:new Date().toLocaleString(),

acao:`🗑️ ${membro.nome} removido de ${setor}`

});

membros.splice(realIndex,1);

saveStorage();

renderTable(setor);

renderHistory();

updateDashboard();

}

/* HISTÓRICO */

function renderHistory(){

const tabela =
document.getElementById(
'historyTable'
);

if(!tabela) return;

tabela.innerHTML = '';

historico.forEach(item=>{

tabela.innerHTML += `

<tr>

<td>${item.data}</td>

<td>${item.acao}</td>

</tr>

`;

});

}

/* INICIALIZAÇÃO */

setores.forEach(setor=>{

renderTable(setor);

});

renderHistory();

updateDashboard();

showPage('dashboard');
