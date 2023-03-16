import React from 'react'
import { Checkbox } from 'antd';

function EmailSms() {
    return (
        <section style={{ width: "710px", height: "830px", border: "0.5px solid rgb(210, 210, 210)", borderLeft: "none" }}>
            <div style={{ margin: "18px 0 0 65px", fontSize: "22px", fontWeight: "lighter" }}>Subscribe:</div>
            <div style={{ margin: "18px 0 22px 68px", fontSize: "14px", fontWeight: "lighter", color: "gray" }}>
                <Checkbox style={{ fontWeight: "bold"}}>comments email</Checkbox>
                <div style={{ marginTop: "1px" }}>Send us your comments on Instagram.</div>
            </div>
            <div style={{ margin: "18px 0 22px 68px", fontSize: "14px", fontWeight: "lighter", color: "gray" }}>
                <Checkbox style={{ fontWeight: "bold"}}>notification email</Checkbox>
                <div style={{ marginTop: "1px" }}>Get unread notifications.</div>
            </div>
            <div style={{ margin: "18px 0 22px 68px", fontSize: "14px", fontWeight: "lighter", color: "gray" }}>
                <Checkbox style={{ fontWeight: "bold" }}>product email</Checkbox>
                <div style={{ marginTop: "1px" }}>Check out our tips for Instagram tools.</div>
            </div>
            <div style={{ margin: "18px 0 22px 68px", fontSize: "14px", fontWeight: "lighter", color: "gray" }}>
                <Checkbox style={{ fontWeight: "bold"}}>news email</Checkbox>
                <div style={{ marginTop: "1px" }}>Learn more about what's new on Instagram.</div>
            </div>
        </section>
    )
}

export default EmailSms
