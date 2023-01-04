    // let validate=()=>{


let id = (id) => document.querySelector(id);
let classes = (error) => document.getElementsByClassName(error);
let username = id("#username"),
  password = id("#password"),
  cPassword = id("#cPassword"),
  email = id("#email"),
  errMsg = classes("error");
(failureIcon = classes("failure-icon")),
  (successIcon = classes("success-icon")),
  (form = id("#form_"));



function validate(e){
  e.preventDefault()
 
  return engineUser(username);
  // engineEmail(email);
  // enginePassword(password)
  // enginecPassword(cPassword)
  
  
}
 
// let engine=(id,serial,message)=>{
//     console.log("helo")
//     if(id.value.trim()==""){
//         errMsg[serial].innerHTML=message
//         failureIcon[serial].style.opacity="1"
//         successIcon[serial].style.opacity='0'

//     }else{
//         errMsg[serial].innerHTML=""
//         failureIcon[serial].style.opacity='0'
//         successIcon[serial].style.opacity='1'
//     }
// }
// ______________________________________user name section__________________________________________________
/*
no whitw space=> trim

 */
let regexUserName = /[^\W][a-z][^\W]/;
let engineUser = (id) => {
  if (id.value.trim() === "") {
    errMsg[0].innerHTML = "user name cannot be blank";
    failureIcon[0].style.opacity = "1";
    return false;

  } else if (regexUserName.test(id.value)) {
    errMsg[0].innerHTML = "";
    successIcon[0].style.opacity = "1";
    failureIcon[0].style.opacity = "0";
    return true
  } else {
    errMsg[0].innerHTML = "Name should be proper";
    failureIcon[0].style.opacity = "1";
    successIcon[0].style.opacity = "0";
    return false;
    
  }
};
// _________________________________________email- address______________________________________________________
let regexUserEmail=/^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+).([a-z]{2,8})(.[a-z]{2,8})?$/


// let engineEmail = (id) => { 
//   if(id.value.trim()===""){
//     errMsg[1].innerHTML="Email cannot be blank"
//     failureIcon[1].style.opacity=1;
//     return false;
    
//   }else if(regexUserEmail.test(id.value)){
//     errMsg[1].innerHTML = "";
//     successIcon[1].style.opacity = "1";
//     failureIcon[1].style.opacity = "0";
//     return true
    

//   }else{
//     errMsg[1].innerHTML="invalid Email"
//     failureIcon[1].style.opacity="1"
//     successIcon[1].style.opacity = "0";
//     return false;
    
//   }
// };
// /*____________________________________________Password__________________________________________________________ */



