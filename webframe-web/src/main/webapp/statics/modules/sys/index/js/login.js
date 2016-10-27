
//获取input的所有id
var user = document.getElementById("user");
var pwd = document.getElementById("pwd");
var surePwd = document.getElementById("surePwd");


//获取span的所有id
var user_pass = document.getElementById("user_pass");
var pwd_pass = document.getElementById("pwd_pass");
var surePwd_pass = document.getElementById("surePwd_pass");
function checkUser(){
    //如果昵称未输入，则提示输入昵称
    if(!user.value){
        user_pass.style.fontSize = "10px";
        user_pass.style.width="100%";
        user_pass.style.height="4em";
        user_pass.style.textAlign="center";
        user_pass.style.lineHeight="2em";
        user_pass.style.marginTop='0.05%';
        user_pass.style.color='red';
        user_pass.innerHTML = '请输入用户名';
        user_pass.style.display="block";
    }
    else if(user.value){
        user_pass.style.display="none";
    }
}

//输入密码提示
function checkPwd(){
    //如果未输入密码，则提示请输入密码
    if(!pwd.value){
        pwd_pass.style.fontSize = "10px";
        pwd_pass.style.width="100%";
        pwd_pass.style.height="4em";
        pwd_pass.style.textAlign="center";
        pwd_pass.style.lineHeight="2em";
        pwd_pass.style.color='red';
        pwd_pass.innerHTML = '请输入密码';
        pwd_pass.style.display="block";
    }
    else{
        pwd_pass.innerHTML ='';
        pwd_pass.style.backgroundColor= "#fff";
        pwd_pass.style.border="none";
        pwd_pass.style.display="none";

    }

}
//验证码验证
function checkCaptch(){
    if(!surePwd.value){
        surePwd_pass.style.fontSize = "10px";
        surePwd_pass.style.width="50%";
        surePwd_pass.style.height="4em";
        surePwd_pass.style.textAlign="center";
        surePwd_pass.style.lineHeight="2em";
        surePwd_pass.style.color='red';
        surePwd_pass.innerHTML = '请输入验证码';
        surePwd_pass.style.display="block";
    }
    else{
        surePwd_pass.innerHTML ='';
        surePwd_pass.style.backgroundColor= "#fff";
        surePwd_pass.style.border="none";
        surePwd_pass.style.display="none";

    }

}


function  submitB(){

    if($("#user").val()==null|| $.trim($("#user").val())==""){
        user_pass.style.fontSize = "10px";
        user_pass.style.width="100%";
        user_pass.style.height="4em";
        user_pass.style.textAlign="center";
        user_pass.style.lineHeight="2em";
        user_pass.style.color='red';
        user_pass.style.marginTop='0.05%';
        user_pass.innerHTML = '请输入用户名';
        user.focus();
        return false;
    }
    if($("#pwd").val()==null|| $.trim($("#pwd").val())==""){
        pwd_pass.style.fontSize = "10px";
        pwd_pass.style.width="100%";
        pwd_pass.style.height="4em";
        pwd_pass.style.textAlign="center";
        pwd_pass.style.lineHeight="2em";
        pwd_pass.style.color='red';
        pwd_pass.style.marginTop='0.05%';
        pwd_pass.innerHTML = '请输入密码';
        pwd.focus();
        return false;
    }

    if($("#surePwd").val()==null|| $.trim($("#surePwd").val())==""){
        surePwd_pass.style.fontSize = "10px";
        surePwd_pass.style.width="50%";
        surePwd_pass.style.height="4em";
        surePwd_pass.style.textAlign="center";
        surePwd_pass.style.lineHeight="2em";
        surePwd_pass.style.color='red';
        surePwd_pass.style.marginTop='0.05%';
        surePwd_pass.innerHTML = '请输入验证码';
        surePwd_pass.focus();
        return false;
    }
    else{
        var f = sendParam();
        return f;
    }

}

