

const form=document.getElementById('myForm');

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const category=document.getElementById('category').value
    if(category===""){
        const error=document.getElementById('error').innerHTML="The name field cannot be empty"
    }else{
        $.ajax({
            url:"/admin_panel/category",
            method:'post',
            data:$('#myForm').serialize(),
            success:(response=>{
                console.log(response)
                if(response. alreadyExist===true){
                    const error=document.getElementById('error').innerHTML="The name field is already Exist"
                }else if(response.postedCategory===true){
                    location.href='/admin_panel/categoryList'
                }
            })
        })
    }
})