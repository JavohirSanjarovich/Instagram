import React from "react";
import { authService } from '../../fbase';
import {useForm,SubmitHandler } from "react-hook-form";
import {Link} from "react-router-dom";
import styled from "styled-components";
import { ToastContainer,toast} from "react-toastify";

interface InputProps {
  hasError?:boolean;
};
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

interface messageProps{
  message?:string;
}
function FormError({message}:messageProps){
  return (message==="" || !message ? null : <span>{message}</span>);
}

interface IForm{
  email:string;
  password:string;
  }

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<IForm>();

  const onSubmit: SubmitHandler<IForm> = async (data) => {
    const { email, password } = data;
    try {
      await authService.signInWithEmailAndPassword(email, password);
      toast.info("You have successfully logged in")
    }
    catch (error:any) {
      toast.error(error.message)
    }

  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", flexDirection: "column" }}>
      <ToastContainer/>
      <div style={{ maxWidth: "350px", width: "100%" }}>
        <div style={{ backgroundColor: "white", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", border: "1px solid #CCCCCC", padding: "40px", marginBottom: "10px" }}>
          <Link to="#"><img alt="logo" src={`${process.env.PUBLIC_URL}/assets/images/instagram_logo.png`} style={{ height: "80px", marginBottom: "20px", width: "100%" }} /></Link>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormError message={errors?.email?.message} />
            <Input {...register("email", { required: "Please enter your e-mail" })} hasError={Boolean(errors?.email?.message)} placeholder="email" type="email" />
            <FormError message={errors?.password?.message} />
            <Input  {...register("password", { required: "Please enter a password" })} hasError={Boolean(errors?.password?.message)} placeholder="password" type="password" />
            <input type="submit" value="log in" style={{ marginTop: "10px", fontWeight: "600", backgroundColor: "#1289F1", color: "white", textAlign: "center", cursor: "pointer", width: "100%", height: "32px", borderRadius: "5px" }} />
          </form>
        </div>
        <div style={{ backgroundColor: "white", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", border: "1px solid #CCCCCC", padding: "20px 0px" }}>
          <span>
          Don't have an account? <Link to="/signup" style={{fontWeight:"600",color:"#1289F1"}}>sign up</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
