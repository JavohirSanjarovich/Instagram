import React ,{useState}from 'react'

function InstagramEmail() {

    const [currentTab, setCurrentTab] = useState(0)

    return (
        <section style={{ width: "710px", height: "830px", border: "0.5px solid rgb(210, 210, 210)", borderLeft: "none" }}>
            <div style={{ margin: "23px 65px 0px 65px", fontSize: "22px", fontWeight: "lighter" }}>
            Email from Instagram
            </div>
            <div style={{ margin: "25px 75px 0px 65px", display: "flex", textAlign: "center" }}>
                {
                    currentTab === 0 ? <div onClick={() => { setCurrentTab(0) }} style={{
                        width: "50%", padding: "15px", fontWeight: "bold",
                        borderBottom: "1px solid black", fontSize: "16px", cursor: "pointer"
                    }}>security</div>
                        : <div onClick={() => { setCurrentTab(0) }} style={{
                            width: "50%", padding: "15px", borderBottom: "1px solid rgb(210, 210, 210)",
                            fontSize: "16px", cursor: "pointer"
                        }}>security</div>
                }
                {
                    currentTab === 1 ? <div onClick={() => { setCurrentTab(1) }} style={{
                        width: "50%", padding: "15px", fontWeight: "bold",
                        borderBottom: "1px solid black", fontSize: "16px", cursor: "pointer"
                    }}>etc</div>
                        : <div onClick={() => { setCurrentTab(1) }} style={{
                            width: "50%", padding: "15px", borderBottom: "1px solid rgb(210, 210, 210)",
                            fontSize: "16px", cursor: "pointer"
                        }}>etc</div>
                }
            </div>
            <div style={{ margin: "25px 75px 0px 65px", fontSize: "18px", color: "gray", paddingBottom: "25px" }}>
                {
                    currentTab === 0 ?
                        <div>
                            Security and login emails from Instagram in the last 14 days will appear here. The emails you receive using this list are real
                            You can check if the one sent by Instagram is correct.&nbsp;<a href="https://help.instagram.com/760602221058803"
                                style={{ color: "rgb(49, 66, 121)" }}>Learn more.</a>
                        </div>
                        : <div>
                            Non-security and login emails from Instagram in the last 14 days will appear here. You can use this list to receive
                            You can verify that the email is from real Instagram.&nbsp;<a href="https://help.instagram.com/760602221058803"
                                style={{ color: "rgb(49, 66, 121)" }}>Learn more.</a>
                        </div>
                }
            </div>
        </section>
    )
}

export default InstagramEmail
