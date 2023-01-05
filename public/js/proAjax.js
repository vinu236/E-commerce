const inpId=document.getElementById('img')
const imageId=document.getElementById('imageId')

inpId.onchange=(eve=>{
    console.log("hello")
    const[file]=inpId.files
    console.log(file)
    if(file){
        imageId.src=URL.createObjectURL(file)
        console.log(imageId.src)
          

        let form_data=new FormData()
        form_data.append("myFiles", document.getElementById('img').files[0]);
       
        
        $.ajax({
    
         url:"/user/update-profile-image",
         method:"post",
         data: form_data,
         contentType: false,
         cache: false,
         processData: false,
         beforeSend:function(){
          $('#uploaded_image').html("<label class='text-success'>Image Uploading...</label>");
         },   
         success:function(data)
         {
          $('#uploaded_image').html("<label class='text-success'>Image Updated</label>");
          let img=document.getElementById('uploaded_image');
          
          setTimeout( ()=>{
            img.innerText=""
          },2000)
         }
        });



    }
})