import React from 'react'
import {Button} from 'antd'

function ContactManagement() {
    return (
        <section style={{ width: "710px", height: "830px", border: "0.5px solid rgb(210, 210, 210)", borderLeft: "none" }}>
            <div style={{ fontSize: "24px", margin: "25px 0 0 65px" }}>contact management</div>
            <div style={{ fontSize: "16px", margin: "20px 66px 0 65px" }}>Instagram App list of contacts uploaded to . Tap Delete All to delete synced contacts.
                 Your contacts will be re-uploaded the next time Instagram syncs them, unless you go to your device settings and turn off access to your contacts.</div>
            <div style={{ fontSize: "16px", margin: "20px 66px 0 65px" }}>The contact information you upload will be used by Instagram to recommend you friends or improve your experience.
                 This contact information is only visible to you.</div>
            <div style={{ fontSize: "16px", margin: "60px 66px 0 65px",fontWeight:"bold",borderBottom:"1px solid rgb(210, 210, 210)",paddingBottom:"10px"}}>0 synced contacts</div> 
            <div style={{ fontSize: "16px", margin: "35px 66px 0 65px",fontWeight:"bold",borderBottom:"1px solid rgb(210, 210, 210)",paddingBottom:"35px"}}>Contact us on Instagram
             Upload it and it will show up here.</div>   
            <Button type="primary" style={{fontWeight:"bold",width:"82px",height:"33px",margin:"20px 0 0 65px",paddingLeft:"10px",borderRadius:"3px"}} size={"middle"}>delete all</Button>
        </section>
    )
}

export default ContactManagement
