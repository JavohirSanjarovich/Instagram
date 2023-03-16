import React,{useState} from 'react'

function AppWeb() {

    const [currentTab,setCurrentTab] = useState(0)

    return (
        <div style={{ width: "710px", height: "830px", border: "0.5px solid rgb(210, 210, 210)", borderLeft: "none" }}>
            <div style={{ fontSize: "28px", color: "gray", margin: "60px 0 0 70px" }}>Apps and Websites</div>
            <div style={{ display: "flex", margin: "35px 40px 0 75px", fontSize: "16px" }}>
                {
                    currentTab === 0 ? <div style={{ flexGrow: 1, textAlign: "center", borderBottom: "1px solid black", paddingBottom: "17px", cursor: "pointer", fontWeight: "bold" }} onClick={() => { setCurrentTab(0) }}>activation</div>
                        : <div style={{ flexGrow: 1, textAlign: "center", borderBottom: "1px solid rgb(210, 210, 210)", paddingBottom: "17px", cursor: "pointer", color: "rgb(190, 190, 190)" }} onClick={() => { setCurrentTab(0) }}>activation</div>
                }
                {
                    currentTab === 1 ? <div style={{ flexGrow: 1, textAlign: "center", borderBottom: "1px solid black", paddingBottom: "17px", cursor: "pointer", fontWeight: "bold" }} onClick={() => { setCurrentTab(1) }}>expired</div>
                        : <div style={{ flexGrow: 1, textAlign: "center", borderBottom: "1px solid rgb(210, 210, 210)", paddingBottom: "17px", cursor: "pointer", color: "rgb(190, 190, 190)" }} onClick={() => { setCurrentTab(1) }}>expired</div>
                }
                {
                    currentTab === 2 ? <div style={{ flexGrow: 1, textAlign: "center", borderBottom: "1px solid black", paddingBottom: "17px", cursor: "pointer", fontWeight: "bold" }} onClick={() => { setCurrentTab(2) }}>deleted</div>
                        : <div style={{ flexGrow: 1, textAlign: "center", borderBottom: "1px solid rgb(210, 210, 210)", paddingBottom: "17px", cursor: "pointer", color: "rgb(190, 190, 190)" }} onClick={() => { setCurrentTab(2) }}>deleted</div>
                }
            </div>
            {
                currentTab === 0 ? <div style={{ margin: "30px 30px 0 75px", fontSize: "16px" }}>
                    <div>Instagram Apps and websites that allow you to log in and ask for information you've recently used and that you choose to share.</div>
                    <div style={{ color: "gray", marginTop: "20px" }}>Instagram No apps have allowed access to your account.</div>
                </div> : currentTab === 1 ? <div style={{ margin: "30px 30px 0 75px", fontSize: "16px" }}>
                    <div>Apps and websites you signed in with using Instagram and haven't used in a while. These apps and websites may still have information you previously shared, but
                        We cannot ask for additional personal information. You can ask the app to delete your information. To request deletion of information, the details and contact information specified in the privacy policy of the app concerned
                        Review your information. Your user ID may be required when contacting the app.</div>
                    <div style={{ color: "gray", marginTop: "20px" }}>Instagram None of the apps with access to the account have expired.</div>
                </div>
                    : <div style={{ margin: "30px 30px 0 75px", fontSize: "16px" }}>
                        <div>These are the apps and websites you deleted from your account. These apps and websites may still have information you previously shared with them, but they cannot ask for more information.
                            You can ask the app to delete your information. To request deletion of your information, please review the details and contact information set out in the app's privacy policy.
                            Your user ID may be required when contacting the app.</div>
                        <div style={{ color: "gray", marginTop: "20px" }}>Instagram None of the apps that had access to the account were deleted.</div>
                    </div>
            }
        </div>
    )
}

export default AppWeb
