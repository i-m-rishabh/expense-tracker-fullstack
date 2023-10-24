async function showReport() {
    try {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:3000/expense/get-all-expense', {
                method: 'GET',
                headers: {
                    'Authorization': token,
                }
            })
            if (!response.ok) {
                throw new Error('erron in getting all expenses');
            }
            const expenses = await response.json();

            // console.log(expenses);
            const choiceButton = document.getElementById('report-display-choice');
            const downloadButton = document.getElementById('download-report');

            // console.log(choiceButton);
            choiceButton.onchange = () => {
                displayReport(event, expenses);
            };
            downloadButton.onclick = () => {
                downloadReport(expenses);
            }
            displayReport(null, expenses);

        } catch (err) {
            console.log(err);
        }
    } catch (err) {
        console.log(err);
    }
}

function displayReport(event, expenses) {
    // console.log(event.target.value);
    const expenseList = document.getElementById('report-list');
    expenseList.innerHTML = '';

    expenses.map((expense) => {
        const { amount, description, category } = expense;
        console.log(amount, description, category);
        let li = document.createElement('li');
        const textNode = document.createTextNode(`${amount} ${description} ${category}`);
        li.appendChild(textNode);

        expenseList.appendChild(li);
    })
}

function downloadReport(expenses) {
    // alert('report downloaded');
    // const reportData = "Your report content here";
    const reportData = JSON.stringify(expenses);
    const blob = new Blob([reportData], { type: 'application/json' });
    const downloadURL = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = downloadURL;
    a.download = 'report.json';
    a.textContent = 'Download Report';

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

}

document.addEventListener('DOMContentLoaded', showReport);