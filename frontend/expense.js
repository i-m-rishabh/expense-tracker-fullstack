
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
        const response = await fetch('http://localhost:3000/expense/add-expense', {
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

//get expense
async function getAllExpenses() {
    const token = localStorage.getItem('token');
    // const userId = +localStorage.getItem('userId');
    try {
        const response = await fetch(`http://localhost:3000/expense/get-all-expense`, {
            method: 'GET',
            headers: {
                'Authorization': token,
            }
        })
        if (!response.ok) {
            throw new Error('errorn in getting all expenses');
        }
        const expenses = await response.json();
        // console.log(data);
        
        expenses.map(expense => {
            showExpense(expense);
        })
    } catch (err) {
        console.log(err);
    }

}

//show expense
function showExpense(expense) {
    const { id, amount, description, category } = expense;
    let today = new Date();

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
        const response = await fetch(`http://localhost:3000/expense/${id}/`, {
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
function redirectToLogin() {
    window.location.replace('signin.html');
    localStorage.removeItem('token');
    localStorage.removeItem('isPremiumUser');
}

const expenseList = document.getElementById('expense-list');
document.addEventListener("DOMContentLoaded", getAllExpenses);