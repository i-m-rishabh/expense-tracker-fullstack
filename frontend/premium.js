const token = localStorage.getItem('token');

document.getElementById('buy-premium').onclick = async function buyPremium(){
    // alert('buying premium')
    const response = await fetch('http://localhost:3000/purchase/premium',{
        method: 'GET',
        headers:{
            'Authorization':token
        }
    });
    const data = await response.json();
    // will receive order_id and key_id;
    console.log(data);
    const options = {
        "order_id": order_id,
        "key_id": key_id,
        "handler": function (){
            //this function will run after successfull payment
        } 
    }

}