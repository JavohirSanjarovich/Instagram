import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'

interface IProps {
    setCurrentTab:()=>void
}


function SecurityHelp({setCurrentTab}:IProps) {
    return (
        <section>
            <div style={{ margin: "22px 65px 0px 60px", fontSize: "16px", color: "black", borderBottom: "1px solid rgb(210, 210, 210)", paddingBottom: "6px" }}>
                <IoIosArrowBack style={{ marginLeft: "10px",cursor:"pointer" }} onClick={setCurrentTab} size={30}/><span style={{ marginLeft: "173px", fontSize: "14px", fontWeight: "bold" }}>Privacy and Security Help</span>
            </div>
            <div style={{margin: "15px 65px 0px 60px", borderBottom: "1px solid rgb(210, 210, 210)",height:"200px",fontSize:"16px"}}>
                <div style={{paddingBottom:"17px",marginLeft:"20px",fontWeight:"bold"}}>account management</div>
                <a href="https://help.instagram.com/517920941588885" target='_blank'><div style={{paddingBottom:"17px",marginLeft:"20px",color:"black"}}>age limit</div></a>
                <a href="https://help.instagram.com/116024195217477" target='_blank'><div style={{paddingBottom:"17px",marginLeft:"20px",color:"black"}}>Account disclosure scope</div></a>
                <a href="https://help.instagram.com/488619974671134" target='_blank'><div style={{paddingBottom:"17px",marginLeft:"20px",color:"black"}}>location sharing</div></a>
                <a href="https://help.instagram.com/566810106808145" target='_blank'><div style={{paddingBottom:"17px",marginLeft:"20px",color:"black"}}>2-step verification</div></a>
            </div>
            <div style={{margin: "15px 65px 0px 60px", height:"200px",fontSize:"16px"}}>
                <div style={{paddingBottom:"17px",marginLeft:"20px",fontWeight:"bold"}}>My Instagram Preferences</div>
                <a href="https://help.instagram.com/426700567389543" target='_blank'><div style={{paddingBottom:"17px",marginLeft:"20px",color:"black"}}>account blocking</div></a>
                <a href="https://help.instagram.com/413012278753813" target='_blank'><div style={{paddingBottom:"17px",marginLeft:"20px",color:"black"}}>delete followers</div></a>
                <a href="https://help.instagram.com/496738090375985" target='_blank'><div style={{paddingBottom:"17px",marginLeft:"20px",color:"black"}}>Manage my photos</div></a>
                <a href="https://help.instagram.com/700284123459336" target='_blank'><div style={{paddingBottom:"17px",marginLeft:"20px",color:"black"}}>Comment filtering</div></a>
                <a href="https://help.instagram.com/1766818986917552" target='_blank'><div style={{paddingBottom:"17px",marginLeft:"20px",color:"black"}}>Disable comment feature</div></a>
                <a href="https://help.instagram.com/289098941190483" target='_blank'><div style={{paddingBottom:"17px",marginLeft:"20px",color:"black"}}>delete comment</div></a>
                <a href="https://help.instagram.com/1177797265575168" target='_blank'><div style={{paddingBottom:"17px",marginLeft:"20px",color:"black"}}>Choose who can see your story</div></a>
                <a href="https://help.instagram.com/1133988223332503" target='_blank'><div style={{paddingBottom:"17px",marginLeft:"20px",color:"black"}}>Choose who to allow to reply to your story</div></a>
                <div style={{paddingBottom:"17px",marginLeft:"20px",fontWeight:"bold"}}>Report content you don't like</div>
                <a href="https://help.instagram.com/198034803689028" target='_blank'><div style={{paddingBottom:"17px",marginLeft:"20px",color:"black"}}>Report a comment</div></a>
                <a href="https://help.instagram.com/192435014247952" target='_blank'><div style={{paddingBottom:"17px",marginLeft:"20px",color:"black"}}>Report an account or post</div></a>
            </div>
        </section>
    )
}

export default SecurityHelp
