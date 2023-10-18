const token = localStorage.getItem('token');

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
            }

        }
    }


    var rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    
    rzp1.on('payment_failed', async function (response) {
        //control doesn't come here when make payment fail ?
        const response2 = await fetch('http://localhost:3000/premium/updatePaymentStatus', {
            method: 'POST',
            body: JSON.stringify({
                order_id: data.order.id,
                payment_id: null,
            }),
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            }
        })
        if (!response2.ok) {
            alert('error in updating payment status');
        } else {
            alert('payment failed');
        }
    })
}