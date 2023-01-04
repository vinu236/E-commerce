const inpId=document.getElementById('img')
const imageId=document.getElementById('imageId')

inpId.onchange=(eve=>{
    console.log("hello")
    const[file]=inpId.files
    console.log(file)
    if(file){
        imageId.src=URL.createObjectURL(file)
        console.log(imageId.src)

        $.ajax({
            url:'/pro-imageUpload',
            method:"put",

        })



    }
})