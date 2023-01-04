



 function validate(e){

    

   
    let uname=document.getElementById('username').value;
    let password=document.getElementById('password').value;
    let cPassword=document.getElementById('cPassword').value;
    let email=document.getElementById("email").value
    let classes=(error)=>document.getElementsByClassName(error)
    errMsg = classes("error");
    failureIcon=classes('failure-icon')
    successIcon=classes('success-icon')
   

    return engineUser(uname,errMsg,failureIcon,successIcon,password,cPassword,email);
   
  
    // if(uname.trim()==""){
    //     alert("failed")
    //     return false;
    // }else{
    //     return true
    // }



   
    
  
    }

    let engineUser=(uname,errMsg,failureIcon,successIcon,password,cPassword,email)=>{
        let returnal=true
    let regexUserName = /[^\W][a-z][^\W]/;
      if (uname.trim() === "") {
       
         
        errMsg[0].innerHTML = "user name cannot be blank";
        failureIcon[0].style.opacity = "1";
        return false;
      } else if (regexUserName.test(uname)) {
        errMsg[0].innerHTML = "";
        successIcon[0].style.opacity = "1";
        failureIcon[0].style.opacity = "0";
       
      } else {
        errMsg[0].innerHTML = "Name should be proper";
        failureIcon[0].style.opacity = "1";
        successIcon[0].style.opacity = "0";
        return false;
        
      }


      /* ----------email------------------------- */

   let regexUserEmail=/^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+).([a-z]{2,8})(.[a-z]{2,8})?$/
   if(email.trim()===""){
     errMsg[1].innerHTML="Email cannot be blank"
     failureIcon[1].style.opacity=1;
     return false;
     
   }else if(regexUserEmail.test(email)){
     errMsg[1].innerHTML = "";
     successIcon[1].style.opacity = "1";
     failureIcon[1].style.opacity = "0";
     
     
 
   }else{
     errMsg[1].innerHTML="invalid Email"
     failureIcon[1].style.opacity="1"
     successIcon[1].style.opacity = "0";
     return false;
     
   }









    


/* ---------------------Password-------------------------------------------------- */
      let regexUsePassword=/^([a-zA-Z0-9]{6,14})$/

  if(password.trim()===""){
    errMsg[2].innerHTML="Password cannot be blank"
    failureIcon[2].style.opacity="1";
    successIcon[2].style.opacity="0"
    return false;
    
  }else if(regexUsePassword.test(password)){
    errMsg[2].innerHTML=""
    failureIcon[2].style.opacity="0"
    successIcon[2].style.opacity="1"
   
    

  }else{
    errMsg[2].innerHTML="Password should be between 6-14"
    failureIcon[2].style.opacity="1"
    successIcon[2].style.opacity="0"
  return false;
  }



let regexUsecPassword=/^([a-zA-Z0-9]{6,14})$/;

  if(cPassword.trim()===""){
    errMsg[3].innerHTML=" Confirm password cannot be blank"
    failureIcon[3].style.opacity="1";
    successIcon[3].style.opacity="0"
    return false;
    
  }else if(regexUsecPassword.test(cPassword)&& cPassword===password){

    errMsg[3].innerHTML="😊❤️"
    failureIcon[3].style.opacity="0"
    successIcon[3].style.opacity="1"
   
   


  }else{
    errMsg[3].innerHTML="Password is not match"
    failureIcon[3].style.opacity="1"
    successIcon[3].style.opacity="0"
    return false;
 

  } 
   

      return returnal;

   


      }


    