

function softDelete(id){
    console.log(id)
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this imaginary file!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
           


            $.ajax({
                url:"/admin_panel/delete_products/"+id,
                method:"put",
                success:(response=>{
                    if( response.deletedProducts==true){
                      
                    location.reload()
                          
                         
                    }else{
                        alert("something went wrong")
                    }
                     
                })

            })





          
        } else {
          swal("Your imaginary file is safe!");
        }
      })
}
async function retrieve(id){
    console.log(id)
    await swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this imaginary file!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
           
            $.ajax({
                url:"/admin_panel/retrieve_products/"+id,
                method:"put",
                success:(response=>{
                    console.log(response)
                    if(response.retrieveProducts==true){
                       
                       
                          location.reload()
                          
                    }else{
                        alert("something went wrong")
                    }
                })

            })





          
        } else {
          swal("Your imaginary file is safe!");
        }
      })
}






/* ---------------------------------------------Category-Delete---------------------------------------- */


function dele(id){
  console.log(id)
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this imaginary file!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      swal("Poof! Your imaginary file has been deleted!", {
        icon: "success",
      });
      $.ajax({
        url:'/delete-category/'+id,
        method:'delete',
        success:(response=>{
          if(response.deleteStatus==true){
            let id=document.getElementById('categoryId')
            id.remove();
          }else{
            alert("something went wrong")
          }
        })
      })
      
    } else {
      swal("Your imaginary file is safe!");
    }
  })
  
}

/* ---------------------------------Category------------------------------------------------------- */
const orderStatus=document.getElementById("orderStatus")
const id=document.getElementById("th-<%=getOrderList._id%>");


id.addEventListener('click',(e)=>{
  console.log("hello")
  e.preventDefault();
console.log(id)
  
  alert(id+"id")
})

function orderSelect(Id,id){
  const s1 =document.getElementById(Id);
  
  const orderStatus=s1.value

  let index = document.getElementById(Id).selectedIndex;
  let option=s1.options[index]
  console.log(option)
  s1.setAttribute('value', 'Placed');

  
 
  console.log('hello')
  console.log(orderStatus)
 
  $.ajax({
    url:'/status-update/'+id,
    
    data:{
      orderStatus:orderStatus
    },
    method:'post',
    success:(response=>{
      console.log(response)
      const updatedStatus=response.data.orderStatus
    
      console.log(updatedStatus)
      if(response){
        if(orderStatus==updatedStatus){
  // select selected options
  

        }else{
          alert("something went wrong")
        }
      }
    })
  })
 
 
 

}
/* ------------------------------------------------------------------------------- */

function deleteBanner(id){
 

  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this imaginary file!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      swal("Poof! Your imaginary file has been deleted!", {
        icon: "success",
      });
      $.ajax({
        url:'/admin_panel/delete-banner/'+id,
        method:'delete',
        success:(response=>{
          console.log()
          if(response.deleted==true){
            const id=document.getElementById('bannerId');
            id.remove();
          }
        })
      })
    } else {
      swal("Your imaginary file is safe!");
    }
  })
 
}








/* --------------------------Coupon Delete---------------------------------------------------------- */
function deleCoupon(id){

  console.log("hello")

  $.ajax({
    url:'/delete-coupon/'+id,
    method:"get",
    success:(response=>{
      console.log(response)

      if(response.deleted==true){
        location.reload()
      }
    })
  })
}