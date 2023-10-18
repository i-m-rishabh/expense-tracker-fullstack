
const token = localStorage.getItem('token');

function activatePremium() {
    if (JSON.parse(localStorage.getItem('isPremiumUser'))) {
        document.getElementById('buy-premium').style.display = 'none';
        document.getElementById('premium-text').style.display = 'block';
    }
}

document.getElementById('buy-premium').onclick = async function buyPremium(e) {
    const response1 = await fetch('http://localhost:3000/premium/purchase_membership', {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    });
    const data = await response1.json();
    // console.log(data);

    const options = {
        "key": data.key_id,
        "order_id": data.order.id,
        "handler": async function (response) {
            alert(['paymentId', response.razorpay_payment_id]);
            const response2 = await fetch('http://localhost:3000/premium/updatePaymentStatus', {
                method: 'POST',
                body: JSON.stringify({
                    order_id: data.order.id,
                    payment_id: response.razorpay_payment_id,
                }),
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                }
            })
            if (!response2.ok) {
                alert('error in updating payment status');
            } else {
                alert('you are a premium member now');
                localStorage.setItem('isPremiumUser', true);
                document.getElementById('buy-premium').style.display = 'none';
                document.getElementById('premium-text').style.display = 'block';
            }
        }
    }

    var rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment_failed', async function (response) {
        //control doesn't come here when make payment fail ?
        // const response2 = await fetch('http://localhost:3000/premium/updatePaymentStatus', {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         order_id: data.order.id,
        //         payment_id: null,
        //     }),
        //     headers: {
        //         'Authorization': token,
        //         'Content-Type': 'application/json',
        //     }
        // })
        console.log(response);
        alert('payment failed');
    })
}
document.getElementById('show-leaderboard-button').onclick = async function () {
    try {
        const response = await fetch('http://localhost:3000/user/get-all-users')
        if (!response.ok) {
            throw new Error('eror in getting users total expenses');
        }
        const data = await response.json();
        console.log(data);
        const users = data.data;

        //sort the data by amount
        users.sort((a, b)=>{
            return b[1] - a[1];
        });
        // console.log(users);
        
        const list = document.getElementById('leaderboard-list');
        list.innerHTML = '';
        users.map((user)=>{
            const li = document.createElement('li');
            const textNode = document.createTextNode(`${user[0]}  ${user[1]}`);
            li.appendChild(textNode);
            list.appendChild(li);
        });
        document.getElementById('leaderboard-section').style.display = 'block';

    } catch (err) {
        console.log(err);
    }
}
document.addEventListener("DOMContentLoaded", activatePremium);


