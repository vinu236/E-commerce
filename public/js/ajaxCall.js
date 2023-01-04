

// function ajaxCart(req){
//     console.log("hello world");
//     let cart=new XMLHttpRequest();





    











    
//     cart.onload=function(response){
       
//         console.log(cart.response)
         
      
//          if(response){
        
//         let count=document.getElementById('count').innerHTML
//         console.log("count:"+count)
//         count=parseInt(count)+1;
//         console.log(count)
//         document.getElementById('count').innerHTML=count ;
//     }
// }
//     cart.send();


// }

function ajaxCart(ID){
    console.log("ajx")
    console.log(ID)
    $.ajax({
        url:'/add-cart/'+ID,
        method:'get',
        success:(response)=>{
            if(response.status=true){
            console.log(response.status)
           
            let count=$('#count').html()
            count=parseInt(count)+1;
            $('#count').html(count)
            
        }}
    })

}

/* ---------------------------------Incrementing -- cart------------------------------------------- */

function changeQty(cartId,prodId,count){
    let quantity=parseInt(document.getElementById(prodId).innerHTML)
    let prdPrice=document.querySelector('.prdPrice').innerHTML
    
    console.log(prdPrice)
    $.ajax({
        url:'/change-quantity',
        data:{
            cart:cartId,
            product:prodId,
            count:count,
            quantity:quantity
        },
        method:'post',
       success:(response)=>{
       
        console.log(response)
       if(response.statusRemove==true){
        location.reload();
       }else if(response.status=true){
        console.log(response.data)
        fetch('/total-amount').then(response=>response.json()).then(data=>{console.log(data)})/* --start from here */
        const totalAmount=response.data[0].total;
        console.log(totalAmount)
       const answer=document.getElementById(prodId).innerHTML=count+quantity;
        const prdPrice=document.querySelector('.prdPrice').innerHTML=totalAmount;
       
        
        
       }
         
       }
    })

}

/* --------------------------------------Checkout------------------------------------------------- */
 $("#checkout-form").submit(e=>{
    e.preventDefault();
    
    $.ajax({
        url:"/check-out",
        method:"post",
        data:$('#checkout-form').serialize(),
        success:((response)=>{
            console.log(response)
            if(response.orderPlaced==true){
                 const order_id=response.data._id
                 console.log(order_id)
                location.href="/order-confirmed?order_id="+order_id
            }else{
                console.log("HELLO WORLD")
                console.log(response[0].orders)
               razorpay(response[0].orders);
            }
        })

    })
})
function razorpay(order){
    console.log("payment")
    
var options = {
    "key": "rzp_test_tN9rva6tbuI8ng", // Enter the Key ID generated from the Dashboard
    "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": "Edd Hardy",
    "description": "Test Transaction",
    "image": "https://example.com/your_logo",
    "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "handler": function (response){
       
        verifyPayment(response,order)
    },
    "prefill": {
        "name": "Gaurav Kumar",
        "email": "gaurav.kumar@example.com",
        "contact": "9999999999"
    },
    "notes": {
        "address": "Razorpay Corporate Office"
    },
    "theme": {
        "color": "#3399cc"
    }
}
var rzp1 = new Razorpay(options);
rzp1.on("payment.failed", function (response) {
});
rzp1.open();
}


function verifyPayment(payment, order) {
    $.ajax({
    url: "/verify-payment",
    data: {
      payment,
      order,
    },
    method: "post",
    success: (response) => {
        console.log(response)
        const id=response.order_id
        console.log(id)
      if (response.success) {
    
        location.href = "/order-confirmed?order_id="+id
      } else {
        // location.href = "/paymentFail";
        alert("payment failed")
      }
},
});
}


/* ---------------------------------------Remove Cart Items---------------------------------------- */
function removeCart(proId){

   console.log(proId);
fetch('/remove-cart/'+proId,
{
    method:'post'
}).then(response=>response.json())
.then(data=>{
    console.log(data)
     location.reload()
})
}



/* ----------------------------------------User-profile---------------------------------------- */


const form=document.getElementById('updateForm')
form.addEventListener('submit',(event)=>{
    event.preventDefault();
    console.log("hello")

    const newPassword=document.querySelector('#newPassword').value;
    const newCPassword=document.querySelector('#newCPassword').value;
    const error=document.getElementsByClassName('error')

    if(newPassword!=newCPassword){
        error[0].innerHTML="Password is not match"
        error[1].innerHTML="password is not match"
        
    }else if(newPassword==''|| newCPassword==''){
        error[0].innerHTML="Password cannot be blank"
        error[1].innerHTML="Password cannot be blank"
        
        
    }
    else {
        error[0].innerHTML=""
        error[1].innerHTML=""
        $.ajax({
            url:"/user/update-profile",
            method:"post",
            data:$('#updateForm').serialize(),
            success:((response)=>{
                console.log(response)
                
                if(response.status==true){
                    
                    swal("Your Password Updated Sucessfully");
                       
                    setTimeout(function() {
                        window.location.href = "http://localhost:8080/login";
                      }, 3000);

                }
            })
        })
    }
   
})



async function del (adId){
   
    await swal({
        title: "Are you sure?",
        text: "You want to delete the address",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          swal("The address has been deleted successfully", {
            icon: "success",
          });
          $.ajax({
            url:'/delete-address/'+adId,
            type:'Delete',
            success:(response=>{
                console.log(response)
                if(response.delete===true){
                    // console.log("HELLO")
                    let delElement=document.getElementById(adId)
                    delElement.remove();
                    // location.reload();
                }
                
            })
        })
        } else {
          swal("Your address will be safe");
        }
      });
    
   
    console.log("hello")
    console.log(adId)
  
   
    
}

/* -----------------------------------Coupon---------------------------------- */

function dis(totalAmount){
    const code=document.querySelector('#code').value
    alert("hello")
    console.log("discount")
    $.ajax({
        url:'/coupon-check',
        method:'post',
        data:({
            code:code,
            totalAmount:totalAmount
        }),
        success:(response=>{
            console.log(response)
            if(response.couponUsed==true){
                let error=document.getElementById("error")
                error.innerHTML="The Coupon is used"
            }else if(response.couponNotFound==true){
                error.innerHTML="Invalid Coupon"
            }else if(response. discountedAmount==true){
                error.innerHTML=''
                console.log(response.finalAmount)
                
                document.getElementById('disPer').innerText=response.discountPercentage+"%"
                document.getElementById('disPrice').innerText=response.discountPrice
                document.getElementById('total').innerText=response.finalAmount;
                document.getElementById('finalAmount').innerHTML=response.finalAmount;
                console.log(response.discountPrice)
                document.querySelector('#discounts').value=response.discountPrice

                // let strikeValue=document.querySelector("finalAmount").value
                // console.log(strikeValue)
                // let result=strikeValue.strike();
                // console.log(result)
                // document.querySelector("finalAmount").innerHTML=result
                     
            }else if(response.limitExceed==true){
                const minAmount=response.minAmount;
                const maxAmount=response.maxAmount
                error.innerHTML=`This coupon can only applied between ${minAmount} and ${maxAmount}`
            }
        })
    })
}


function wishlist(Id){
    console.log("id")
    $.ajax({
        url:'/add-wishlist/'+Id,    
        method:'post',
        success:(response=>{
            console.log("vaogu")
            console.log(response)
            if(response.createdWishlist==true){
                console.log("success")
                
            }else if(response.createNewProduct==true){
                console.log("CreateNewProduct")
                
            }else if(response.wishlistRemoved==true){
                console.log("WishlistRemoved")
                
            }
        })
        
    })

}

function deleteWishlist(ID){
    console.log("helloo world ")
    $.ajax({
        url:'/delete-wishlist/'+ID,
        method:"delete",
        success:(response=>{
            if(response.removed==true){
            const rowDelete=document.getElementById(ID).remove();
            location.reload();
        }else{
            alert("something went wrong")
        }

        })
    })
}