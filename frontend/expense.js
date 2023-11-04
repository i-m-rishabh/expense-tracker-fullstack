
//add expense
async function addExpense(event) {
    const token = localStorage.getItem('token');
    // const userId = +localStorage.getItem('userId');

    event.preventDefault();
    // alert("adding expense");
    const amount = +event.target.amount.value;
    const description = event.target.description.value;
    const category = event.target.category.value;

    // alert([amount,description,category]);

    try {
        const response = await fetch('http://13.48.153.222:3000/expense/add-expense', {
            method: 'POST',
            body: JSON.stringify({
                // userId,
                amount,
                description,
                category,
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            }
        });

        if (!response.ok) {
            throw new Error('something went wrong');
        }
        const data = await response.json();

        // show expense in frontend
        // console.log(data);
        showExpense(data.response);

    } catch (err) {
        console.log(err);
    }
}

async function generateExpenses() {
    //when the page reload it automatically fetch the saved preference of the user if have any
    let rowsPerPage = localStorage.getItem('rows_per_page');
    if(rowsPerPage){
        document.getElementById('rows-per-page').value = rowsPerPage;
    }


    let currentPage = 1;
    let lastPage = 1;
    let p = '';
    const buttonList = document.getElementById('pagination-buttons');

    const prevButton = document.createElement('button');
    prevButton.textContent = 'prev';
    prevButton.onclick = async () => {
        if (currentPage > 1) {
            currentPage = currentPage - 1;
            lastPage = await getAllExpenses(currentPage);
            p.textContent = ` ${currentPage} / ${lastPage} `;

        }
    }

    const nextButton = document.createElement('button');
    nextButton.textContent = 'next';
    nextButton.onclick = async () => {
        if (currentPage < lastPage) {
            currentPage = currentPage + 1;
            lastPage = await getAllExpenses(currentPage);
            p.textContent = ` ${currentPage} / ${lastPage} `;

        }
    }

    lastPage = await getAllExpenses(currentPage);
    if(!lastPage){
        lastPage = 1;
    }
    buttonList.appendChild(prevButton);
    p = document.createElement('p');
    p.id = 'page-status';
    p.style.display = 'inline';
    p.textContent = ` ${currentPage} / ${lastPage} `;
    buttonList.appendChild(p);
    buttonList.appendChild(nextButton);
}

//get expense
async function getAllExpenses(currentPage) {
    let rowsPerPage = +localStorage.getItem('rows_per_page') || 1;
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';
    const token = localStorage.getItem('token');
    // const userId = +localStorage.getItem('userId');
    try {
        const response = await fetch(`http://13.48.153.222:3000/expense/get-all-expense/?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`, {
            method: 'GET',
            headers: {
                'Authorization': token,
            }
        })
        if (!response.ok) {
            throw new Error('errorn in getting all expenses');
        }
        const res = await response.json();
        // console.log(res);
        if (res.success) {
            res.response.expenses.map(expense => {
                showExpense(expense);
            })
            return new Promise((resolve, reject) => {
                resolve(res.response.lastPage);
            })
        } else {
            console.log(res.message);
        }
    } catch (err) {
        console.log(err);
    }
}



//show expense
function showExpense(expense) {
    const { id, amount, description, category } = expense;
    // let today = new Date();

    // console.log(id, amount, description, category);
    const expenseList = document.getElementById('expense-list');

    const li = document.createElement('li');
    li.id = id;
    const textNode = document.createTextNode(`${amount} ${description} ${category} `);
    const delButton = document.createElement('button');
    delButton.textContent = 'delete';
    delButton.addEventListener('click', deleteExpense);

    li.appendChild(textNode);
    li.appendChild(delButton);

    expenseList.appendChild(li);
}

//delete expense
async function deleteExpense(event) {
    const token = localStorage.getItem('token');
    // const userId = +localStorage.getItem('userId');
    const li = event.target.parentElement;
    const id = li.id;
    try {
        const response = await fetch(`http://13.48.153.222:3000/expense/${id}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': token,
            }
        });
        if (!response.ok) {
            throw new Error('error in deleting expense');
        }
        const data = await response.json();
        // console.log(data);

        expenseList.removeChild(li);
        // console.log(li);
        alert('expense deleted successfully');

    } catch (err) {
        console.log(err);
    }
}

async function getAllFiles() {
    try {
        const response = await fetch('http://13.48.153.222:3000/file/getAllFiles', {
            method: 'GET',
            headers: {
                'Authorization': token,
            }
        });
        if (!response.ok) {
            throw new Error('error in getting file');
        }
        const data = await response.json();
        console.log(data);
        //call a function which show all the file list in frontend
        showFiles(data.files);

    } catch (err) {
        console.log(err);
    }
}

function showFiles(files) {
    const list = document.getElementById('downloaded-file-list');

    files.map((file) => {
        let li = document.createElement('li');
        let a = document.createElement('a');
        a.href = file.Url;
        a.textContent = file.name;

        li.appendChild(a);
        list.appendChild(li);
    })    
}

//setting rows per page 
document.getElementById("rows-per-page").onchange = (event)=>{
    let rows_per_page = event.target.value;
    // console.log(rows_per_page);
    localStorage.setItem('rows_per_page', rows_per_page);
    location.reload();
}

function redirectToLogin() {
    window.location.replace('signin.html');
    localStorage.removeItem('token');
    localStorage.removeItem('isPremiumUser');
}

const expenseList = document.getElementById('expense-list');
document.addEventListener("DOMContentLoaded", generateExpenses);
document.addEventListener('DOMContentLoaded', getAllFiles);