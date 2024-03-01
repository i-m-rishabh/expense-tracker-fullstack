// const serverEndPoint = 'http://localhost:3000';
const serverEndPoint = 'https://expense-tracker-fullstack.onrender.com';

//sign up page ................................................................................. 

async function createUser(event) {
    event.preventDefault();
    // alert('creating user');
    const username = event.target.username.value;
    const email = event.target.email.value;
    const phone = event.target.phone.value;
    const password = event.target.password.value;

    try {
        const response = await fetch(`${serverEndPoint}/user/signup`, {
            method: 'POST',
            body: JSON.stringify({
                username,
                email,
                phone,
                password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            throw new Error('Error in signup');
        }
        const data = await response.json();
        // console.log(data);
        alert('signed up successfully');
        redirectToLogin();

    } catch (err) {
        console.log(err);
    }
}


// login page ...............................................................................

async function loginUser(event) {
    event.preventDefault();
    // alert('loggin in user');
    const email = event.target.email.value;
    const password = event.target.password.value;
    // alert([email, password])

    try {
        const response = await fetch(`${serverEndPoint}/user/signin`, {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data);
        }
        // alert(data.token);
        localStorage.setItem('token', data.token);
        // localStorage.setItem('isPremiumUser', data.isPremiumUser);
        redirectToMainPage();
    } catch (err) {
        console.log(err)
        alert(err);
    }
}
async function resetPassword(event) {
    event.preventDefault();
    alert('reseting password');
    const email = event.target.email.value;
    console.log(email);


    //calling api
    try {
        const response = await fetch(`${serverEndPoint}/password/forget-password`, {
            method: 'POST',
            body: JSON.stringify({
                email: email
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(!response.ok){
            throw new Error('something went wrong');
        }
        const data = await response.json();
        console.log(data);
    // redirectToLogin();

    } catch(err){
        console.log(err);
    }
    
    

}

function redirectToMainPage() {
    window.location.replace('expense.html');
}
function redirectToSignup() {
    window.location.replace('signup.html');
}
function redirectToLogin() {
    window.location.replace('signin.html');
}
function redirectToForgetPassword() {
    window.location.replace('forget-password.html');
}


