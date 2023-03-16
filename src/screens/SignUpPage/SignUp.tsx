import React, {useState} from "react";
import {useForm,SubmitHandler } from "react-hook-form";
import {authService,faceBookLogin,databaseService} from "../../fbase";
import {Link, useHistory} from "react-router-dom";
import styled from "styled-components";
import { ToastContainer,toast} from "react-toastify";

const Input=styled.input<InputProps>`
    box-sizing:border-box;
    width:100%;
    height:35px;
    margin-bottom:5px;
    border-radius:5px;
    background-color:${(props)=>props.theme.bgColor};
    border:0.5px solid ${(props)=>props.hasError? "red" : props.theme.borderColor};
    padding:0px 10px ;
 
`;

interface InputProps {
  hasError?:boolean;
};

interface messageProps{
  message?:string;
}
function FormError({message}:messageProps){
  return (message==="" || !message ? null : <span>{message}</span>);
}


interface IForm {
  email: string;
  name: string;
  username: string;
  password: string;
}

function SignUp() {
  const { register, handleSubmit, formState: { errors } } = useForm<IForm>();
  const history = useHistory();
  const [name,setName] = useState("")
  const [userName,setUserName] = useState("")

  const onSocialLogin = () => {
    try {
      faceBookLogin();
      history.push("/");
    } catch (error) {
      console.log(error);
    }
  }
  const onSubmit: SubmitHandler<IForm> = async (data) => {

    const { email, password } = data;
    try {
      let createdUser: any = await authService.createUserWithEmailAndPassword(email, password);
      const fullName = name.concat(userName) 
      await createdUser.user.updateProfile({ 
        displayName: fullName,
        photoURL: `https://firebasestorage.googleapis.com/v0/b/instagram-aaebd.appspot.com/o/profile_image.jpg?alt=media&token=5bebe0eb-6552-40f6-9aef-cd11d816b619`,
      });

      await databaseService.ref("users").child(createdUser.user.uid).set({
        name: createdUser.user.displayName,
        image: createdUser.user.photoURL,
        id:createdUser.user.uid
      });
      toast.info("You have successfully registered as a member")
      history.push("/", { message: "Account created. Please log in.", email, password });
    } catch (error:any) {
      toast.error(error.message)
    }

  };
  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"80vh"}}>
      <ToastContainer/>
      <div style={{  maxWidth:"350px" , width:"100%"}}>
        <div style={{ backgroundColor: "white", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", border: "1px solid #CCCCCC", padding: "40px", marginBottom: "10px" }}>
          <Link to="#"><img alt="logo" src={`${process.env.PUBLIC_URL}/assets/images/instagram_logo.png`} style={{ height: "80px", marginBottom: "10px", width: "100%" }} /></Link>
          <div style={{ opacity: "0.5", fontWeight: "600", textAlign: "center", width: "100%", fontSize: "17px" }}><span>To view your friends' photos and videos <br /></span></div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormError message={errors?.email?.message} />
            <Input {...register("email", { required: "Please enter your e-mail" })} hasError={Boolean(errors?.email?.message)} placeholder="email" type="email" />
            <FormError message={errors?.name?.message} />
            <Input {...register("name", { required: "Input your name, please" })} hasError={Boolean(errors?.name?.message)} placeholder="name" type="text" onChange={(e) => setName(e.target.value)} />
            <FormError message={errors?.username?.message} />
            <Input {...register("username", { required: "Please enter your username" })} hasError={Boolean(errors?.username?.message)} placeholder="username" type="text" onChange={(e) => setUserName(e.target.value)} />
            <FormError message={errors?.password?.message} />
            <Input  {...register("password", {
              required: "Please enter a password",
              minLength: {
                value: 6, message: "Password must be at least 6 characters"
              }
            })} hasError={Boolean(errors?.password?.message)} placeholder="password" type="password" />
            <input type="submit" value="sign up" style={{ marginTop: "10px", fontWeight: "600", backgroundColor: "#1289F1", color: "white", textAlign: "center", cursor: "pointer", width: "100%", height: "35px", borderRadius: "5px" }} />
          </form>
        </div>
        <div style={{ backgroundColor: "white", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", border: "1px solid #CCCCCC", padding: "20px 0px" }}>
          <span>
          Do you have an account? <Link to="/login" style={{fontWeight:"600",color:"#1289F1"}}>log in</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
