import React from 'react'
import { Checkbox } from 'antd'

function PersonalnformationSecurity() {
    return (
        <section style={{ width: "710px", height: "830px", border: "0.5px solid rgb(210, 210, 210)", borderLeft: "none" }}>
            <div style={{ margin: "30px 0 0 50px", fontSize: "24px", fontWeight: "500" }}>Account disclosure scope</div>
            <div style={{ margin: "18px 0 22px 50px", fontSize: "14px", fontWeight: "lighter", color: "gray" }}>
                <Checkbox style={{ fontWeight: "bold", margin: "0 0 3px 3px" }}>comments email</Checkbox>
                <div style={{ margin: "5px 50px 10px 0", borderBottom: "1px solid rgb(210, 210, 210)",paddingBottom:"25px" }}>If your account is private, only people you authorize You can see your photos and videos on Instagram.
                Existing followers are not affected.</div>
            </div>
            <div style={{ margin: "0 0 0 50px", fontSize: "24px", fontWeight: "500" }}>activity state</div>
            <div style={{ margin: "18px 0 22px 50px", fontSize: "14px", fontWeight: "lighter", color: "gray" }}>
                <Checkbox style={{ fontWeight: "bold", margin: "0 0 3px 3px" }}>Show activity status</Checkbox>
                <div style={{ margin: "5px 50px 10px 0", borderBottom: "1px solid rgb(210, 210, 210)",paddingBottom:"25px" }}>In the Instagram app, information about how long you've been active is visible to the accounts you follow and anyone you message.
                    If you turn off this setting, you won't be able to see the activity status of other accounts.</div>
            </div>
            <div style={{ margin: "0 0 0 50px", fontSize: "24px", fontWeight: "500" }}>Share your story</div>
            <div style={{ margin: "18px 0 22px 50px", fontSize: "14px", fontWeight: "lighter", color: "gray" }}>
                <Checkbox style={{ fontWeight: "bold", margin: "0 0 3px 3px" }}>Allow sharing</Checkbox>
                <div style={{ margin: "5px 50px 20px 0", borderBottom: "1px solid rgb(210, 210, 210)",paddingBottom:"25px" }}>People can share your story in messages</div>
            </div>
        </section>
    )
}

export default PersonalnformationSecurity
