let currentId = 1; 

const employeePhoto = document.getElementById('employee-photo');
const employeeIdText = document.getElementById('employee-id');
const employeeName = document.getElementById('employee-name');
const employeeTitle = document.getElementById('employee-title');
const employeeDept = document.getElementById('employee-dept');
const employeeEmail = document.getElementById('employee-email');

const searchInput = document.getElementById('search-input');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');

async function fetchEmployeeData(id) {
    try {
        // Exibe um estado de carregamento rápido nos campos de texto
        employeeName.textContent = "Carregando...";
        employeeTitle.textContent = "--";
        employeeDept.textContent = "--";
        employeeEmail.textContent = "--";
        employeeIdText.textContent = `ID: ${id}`;

        const responseDummy = await fetch(`https://dummyjson.com/users/${id}`);
        
        if (!responseDummy.ok) {
            throw new Error("Funcionário não encontrado na base de dados.");
        }
        
        const userData = await responseDummy.json();

        const fullName = `${userData.firstName} ${userData.lastName}`;
        const role = userData.company?.title || "Não informado";
        const department = userData.company?.department || "Não informado";
        const email = userData.email;
        const gender = userData.gender; // Usado para filtrar a segunda API (male ou female)

        const responseRandomUser = await fetch(`https://randomuser.me/api/?gender=${gender}`);
        
        if (!responseRandomUser.ok) {
            throw new Error("Erro ao buscar a foto de perfil.");
        }
        
        const photoData = await responseRandomUser.json();
        
        const photoUrl = photoData.results[0].picture.large;

        employeeName.textContent = fullName;
        employeeTitle.textContent = role;
        employeeDept.textContent = department;
        employeeEmail.textContent = email;
        employeePhoto.src = photoUrl;
        employeePhoto.alt = `Foto de ${fullName}`;

    } catch (error) {
        console.error("Erro na operação:", error);
        employeeName.textContent = "Erro ao carregar";
        employeeTitle.textContent = "N/A";
        employeeDept.textContent = "N/A";
        employeeEmail.textContent = error.message;
        employeePhoto.src = ""; 
        employeePhoto.alt = "Erro";
    }


}



btnNext.addEventListener('click', () => {
    currentId++;
    searchInput.value = ''; // Limpa o campo de busca para manter o visual limpo
    fetchEmployeeData(currentId);
});

btnPrev.addEventListener('click', () => {
    if (currentId > 1) {
        currentId--;
        searchInput.value = '';
        fetchEmployeeData(currentId);
    } else {
        alert("O limite inferior foi atingido. O ID mínimo é 1.");
    }
});

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const searchedId = parseInt(searchInput.value.trim(), 10);

        // Valida se o valor digitado é um número válido e maior que 0
        if (!isNaN(searchedId) && searchedId > 0) {
            currentId = searchedId;
            fetchEmployeeData(currentId);
        } else {
            alert("Por favor, insira um ID numérico válido (maior que 0).");
        }
    }
});

window.addEventListener('DOMContentLoaded', () => {
    fetchEmployeeData(currentId);
});