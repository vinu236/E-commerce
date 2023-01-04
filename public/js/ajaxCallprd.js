
function prd(orderId){
 console.log("adhil")
 console.log(orderId)
$.ajax({
    url:'/user/order-details-view/'+orderId,
    method:'get',
    success:((response)=>{
        console.log(response)
        if(response.status==true){
            document.getElementsByClassName('tb').innerHTML="response.data.name";

        }
    })
})

}
