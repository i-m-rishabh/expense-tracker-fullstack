//sign up page ................................................................................. 

async function createUser(event) {
    event.preventDefault();
    // alert('creating user');
    const username = event.target.username.value;
    const email = event.target.email.value;
    const phone = event.target.phone.value;
    const password = event.target.password.value;

    try {
        const response = await fetch('http://localhost:3000/user/signup', {
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
        const response = await fetch('http://localhost:3000/user/signin', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (!response.ok) {
            throw new Error('error in signing in ');
        }
        const data = await response.json();
        // alert(data.token);
        localStorage.setItem('token', data.token);
        // localStorage.setItem('isPremiumUser', data.isPremiumUser);
        redirectToMainPage();
    } catch (err) {
        console.log(err)
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


