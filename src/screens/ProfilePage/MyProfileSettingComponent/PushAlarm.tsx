import React from 'react'
import { Radio } from 'antd';

function PushAlarm() {
    return (
        <section style={{ width: "710px", height: "830px", border: "0.5px solid rgb(210, 210, 210)", borderLeft: "none" }}>
            <div style={{ margin: "25px 25px 0 25px",height:"160px" , borderBottom:"1px solid rgb(210, 210, 210)"}}>
                <div style={{  fontSize: "22px", fontWeight: "lighter" }}>great</div>
                <Radio.Group name="radiogroup" defaultValue={1} style={{ margin: "20px 0 0 5px", fontWeight: "bold" }}>
                    <div><Radio value={1}>clear</Radio></div>
                    <div><Radio value={2}>people i follow</Radio></div>
                    <div><Radio value={3}>Everyone</Radio></div>
                </Radio.Group>
            </div>
            <div style={{ margin: "25px 25px 0 25px",height:"160px" , borderBottom:"1px solid rgb(210, 210, 210)"}}>
                <div style={{  fontSize: "22px", fontWeight: "lighter" }}>comment</div>
                <Radio.Group name="radiogroup" defaultValue={1} style={{ margin: "20px 0 0 5px", fontWeight: "bold" }}>
                    <div><Radio value={1}>comment</Radio></div>
                    <div><Radio value={2}>people i follow</Radio></div>
                    <div><Radio value={3}>Everyone</Radio></div>
                </Radio.Group>
            </div>
            <div style={{ margin: "25px 25px 0 25px",height:"160px" , borderBottom:"1px solid rgb(210, 210, 210)"}}>
                <div style={{  fontSize: "22px", fontWeight: "lighter" }}>comment like</div>
                <Radio.Group name="radiogroup" defaultValue={1} style={{ margin: "20px 0 0 5px", fontWeight: "bold" }}>
                    <div><Radio value={1}>clear</Radio></div>
                    <div><Radio value={2}>people i follow</Radio></div>
                </Radio.Group>
            </div>
        </section>
    )
}

export default PushAlarm
