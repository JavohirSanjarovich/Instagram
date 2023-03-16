import React,{useState} from 'react'
import NavbarComponent from '../common/Navbar'
import EditProfile from './MyProfileSettingComponent/EditProfile'
import ChangePassword from './MyProfileSettingComponent/ChangePassword'
import AppWeb from './MyProfileSettingComponent/AppWeb'
import EmailSns from './MyProfileSettingComponent/EmailSns'
import PushAlarm from './MyProfileSettingComponent/PushAlarm'
import ContactManagement from './MyProfileSettingComponent/ContactManagement'
import Personalnformationsecurity from './MyProfileSettingComponent/PersonalnformationSecurity'
import LoginActivity from './MyProfileSettingComponent/LoginActivity'
import InstagramEmail from './MyProfileSettingComponent/InstagramEmail'
import Help from './MyProfileSettingComponent/Help'


function Myprofilesetting() {

    const [currentTab,setCurrentTabe] = useState(0)
    return (
        <>
            <NavbarComponent />
            <main  className="profileSettingContainer" style={{ margin: "30px 0 0 25%", display: "flex", backgroundColor: "white",width:"940px" }}>
                <aside><div style={{ width: "230px", height: "650px", border: "0.5px solid rgb(210, 210, 210)" }}><div style={{ borderRadius: "35px" }}>
                    {
                        currentTab === 0?<div className='setting_btn1' style={{ height: "52px", fontSize: "16px", padding: "15px 0 0 30px", cursor: "pointer",borderLeft:"2px solid black" }} onClick={()=>{setCurrentTabe(0)}}>Edit Profile</div>
                        :<div className='setting_btn1' style={{ height: "52px", fontSize: "16px", padding: "15px 0 0 30px", cursor: "pointer" }} onClick={()=>{setCurrentTabe(0)}}>Edit Profile</div>
                    }
                    {
                        currentTab === 1?<div className='setting_btn2' style={{ height: "52px", fontSize: "16px", padding: "15px 0 0 30px", cursor: "pointer",borderLeft:"2px solid black" }} onClick={()=>{setCurrentTabe(1)}}>Change Password</div>
                        : <div className='setting_btn2' style={{ height: "52px", fontSize: "16px", padding: "15px 0 0 30px", cursor: "pointer" }} onClick={()=>{setCurrentTabe(1)}}>Change Password</div>
                    }
                    {
                        currentTab === 2?<div className='setting_btn3' style={{ height: "52px", fontSize: "16px", padding: "15px 0 0 30px", cursor: "pointer",borderLeft:"2px solid black" }} onClick={()=>{setCurrentTabe(2)}}>Apps and Websites</div>
                        :<div className='setting_btn3' style={{ height: "52px", fontSize: "16px", padding: "15px 0 0 30px", cursor: "pointer" }} onClick={()=>{setCurrentTabe(2)}}>Apps and Websites</div>
                    }
                    {
                        currentTab === 3?<div className='setting_btn4' style={{ height: "52px", fontSize: "16px", padding: "15px 0 0 30px", cursor: "pointer",borderLeft:"2px solid black" }} onClick={()=>{setCurrentTabe(3)}}>Email and SMS</div>
                        :<div className='setting_btn4' style={{ height: "52px", fontSize: "16px", padding: "15px 0 0 30px", cursor: "pointer" }} onClick={()=>{setCurrentTabe(3)}}>Email and SMS</div>
                    }
                    {
                        currentTab === 4?<div className='setting_btn5' style={{ height: "52px", fontSize: "16px", padding: "15px 0 0 30px", cursor: "pointer",borderLeft:"2px solid black" }} onClick={()=>{setCurrentTabe(4)}}>Push Alarm</div>
                        :<div className='setting_btn5' style={{ height: "52px", fontSize: "16px", padding: "15px 0 0 30px", cursor: "pointer" }} onClick={()=>{setCurrentTabe(4)}}>Push Alarm</div>
                    }
                    {
                        currentTab === 5?<div className='setting_btn6' style={{ height: "52px", fontSize: "16px", padding: "15px 0 0 30px", cursor: "pointer",borderLeft:"2px solid black" }} onClick={()=>{setCurrentTabe(5)}}>contact management</div>
                        :<div className='setting_btn6' style={{ height: "52px", fontSize: "16px", padding: "15px 0 0 30px", cursor: "pointer" }} onClick={()=>{setCurrentTabe(5)}}>contact management</div>
                    }
                    {
                        currentTab === 6?<div className='setting_btn7' style={{ height: "52px", fontSize: "16px", padding: "15px 0 0 30px", cursor: "pointer",borderLeft:"2px solid black" }} onClick={()=>{setCurrentTabe(6)}}>Privacy and Security</div>
                        :<div className='setting_btn7' style={{ height: "52px", fontSize: "16px", padding: "15px 0 0 30px", cursor: "pointer" }} onClick={()=>{setCurrentTabe(6)}}>Privacy and Security</div>
                    }
                    {
                        currentTab === 7?<div className='setting_btn8' style={{ height: "52px", fontSize: "16px", padding: "15px 0 0 30px", cursor: "pointer",borderLeft:"2px solid black" }} onClick={()=>{setCurrentTabe(7)}}>login activity</div>
                        :<div className='setting_btn8' style={{ height: "52px", fontSize: "16px", padding: "15px 0 0 30px", cursor: "pointer" }} onClick={()=>{setCurrentTabe(7)}}>login activity</div>
                    }
                    {
                        currentTab === 8?<div className='setting_btn9' style={{ height: "72px", fontSize: "16px", padding: "15px 5px 20px 30px", cursor: "pointer",borderLeft:"2px solid black" }} onClick={()=>{setCurrentTabe(8)}}>Email from Instagram</div>
                        :<div className='setting_btn9' style={{ height: "72px", fontSize: "16px", padding: "15px 5px 20px 30px", cursor: "pointer" }} onClick={()=>{setCurrentTabe(8)}}>Email from Instagram</div>
                    }
                    {
                        currentTab === 9?<div className='setting_btn10' style={{ height: "52px", fontSize: "16px", padding: "15px 0 0 30px", cursor: "pointer",borderLeft:"2px solid black" }} onClick={()=>{setCurrentTabe(9)}}>Help</div>
                        :<div className='setting_btn10' style={{ height: "52px", fontSize: "16px", padding: "15px 0 0 30px", cursor: "pointer" }} onClick={()=>{setCurrentTabe(9)}}>Help</div>
                    }               
                </div></div>
                    <div style={{ width: "230px", height: "180px", border: "0.5px solid rgb(210, 210, 210)", borderTop: "none", padding: "20px 0 0 30px" }}>
                        <div style={{ fontSize: "15px", fontWeight: "550" }}><img src={`${process.env.PUBLIC_URL}/assets/images/meta.png`} style={{ marginLeft: "-2px" }} />Meta</div>
                        <div style={{ fontSize: "15px", margin: "5px 0 7px 0", color: "rgb(41, 149, 238)", fontWeight: "bold" }}>account center</div>
                        <div style={{ fontSize: "11px", color: "gray", marginRight: "20px" }}>Manage settings for the connected experience between Instagram, the Facebook app, and Messenger, including sharing stories and posts and signing in.</div>
                    </div>
                </aside>
                {
                    
                    currentTab === 0 ? <EditProfile /> :
                        currentTab === 1 ? <ChangePassword /> :
                            currentTab === 2 ? <AppWeb /> :
                                currentTab === 3 ? <EmailSns /> :
                                    currentTab === 4 ? <PushAlarm /> :
                                        currentTab === 5 ? <ContactManagement /> :
                                            currentTab === 6 ? <Personalnformationsecurity /> :
                                                currentTab === 7 ? <LoginActivity /> :
                                                    currentTab === 8 ? <InstagramEmail /> :
                                                        <Help />
                }
            </main>
        </>
    )
}

export default Myprofilesetting 