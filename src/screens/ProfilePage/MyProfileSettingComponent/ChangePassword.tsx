import React,{useState} from 'react'
import {useSelector} from 'react-redux'
import {RootState} from '../../../redux/_reducers'
import {Button} from 'antd'
import {authService} from '../../../fbase'
import {toast} from "react-toastify";


function ChangePassword() {

    const [prePassword,setPrePassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    const currentUser = useSelector((state: RootState) => state.user.currentUser)


    const changePassword = () => {
        if (prePassword && newPassword && confirmNewPassword) {
            if(newPassword!==confirmNewPassword){
                toast.error("Make sure both passwords are the same")
            }
            else{
                authService.currentUser &&authService.currentUser.updatePassword(newPassword).then(() => {
                    toast.info("Password change is complete")
                  }).catch((error) => {
                    toast.error("Password change failed")
                  });
            }
        }
    }
    

    return (
        <div style={{ width: "710px", height: "830px", border: "0.5px solid rgb(210, 210, 210)", borderLeft: "none" }}>
            <div style={{ margin: "30px 0 0 123px", display: "flex" }}><img src={currentUser.photoURL} style={{borderRadius:"100%"}}width={40} height={40} /><div style={{ fontSize: "22px", margin: "5px 0 0 26px" }}>{currentUser &&currentUser.displayName}</div></div>
            <div style={{ margin: "33px 0 0 62px", display: "flex", fontSize: "16px" }}><span style={{ fontWeight: "bold" }}>old password</span>
                <input type="password" style={{
                    width: "430px", padding: "6px 0 6px 10px", margin: "-3px 0 0 32px", border: "1px solid rgb(200, 200, 200)",
                    borderRadius: "5px", backgroundColor: "rgb(250, 250, 250)"
                }} value={prePassword} onChange={(e)=>{setPrePassword(e.target.value)}}/></div>
            <div style={{ margin: "20px 0 0 78px", display: "flex", fontSize: "16px" }}><span style={{ fontWeight: "bold" }}>New password</span>
                <input type="password" style={{
                    width: "430px", padding: "6px 0 6px 10px", margin: "-3px 0 0 32px", border: "1px solid rgb(200, 200, 200)",
                    borderRadius: "5px", backgroundColor: "rgb(250, 250, 250)"
                }} value={newPassword} onChange={(e) => { setNewPassword(e.target.value) }} /></div>
            <div style={{ margin: "20px 0 0 41px", display: "flex", fontSize: "16px" }}><span style={{ fontWeight: "bold" }}>New password confirmation</span>
                <input type="password" style={{
                    width: "430px", padding: "6px 0 6px 10px", margin: "-3px 0 0 32px", border: "1px solid rgb(200, 200, 200)",
                    borderRadius: "5px", backgroundColor: "rgb(250, 250, 250)"
                }} value={confirmNewPassword} onChange={(e) => { setConfirmNewPassword(e.target.value) }} /></div>
                {
                    prePassword && newPassword && confirmNewPassword ? <Button type="primary" style={{
                        fontWeight: "bold", width: "110px", margin: "30px 0 0 197px",
                        paddingLeft: "10px", borderRadius: "5px"
                    }} size={"middle"} onClick={changePassword}>Change Password</Button> :
                    <Button type="primary" style={{
                        fontWeight: "bold", width: "110px", margin: "30px 0 0 197px",
                        paddingLeft: "10px", borderRadius: "5px",color:"white"
                    }} size={"middle"} disabled>Change Password</Button>
                }
            <div style={{ color: "rgb(41, 149, 238)", fontWeight: "bold", margin: "30px 0 0 196px" }}>Forgot your password?</div>
        </div>
    )
}

export default ChangePassword
