import React,{useState} from 'react'
import {GoLocation} from 'react-icons/go'
import {IoIosArrowDown,IoIosArrowUp} from 'react-icons/io'
import { authService } from '../../../fbase'
import Map from './Map'

function LoginActivity() {
    const [mapToggle,setMapToggle] = useState(true)


    const handleLogout = () => { 
        authService.signOut()
    }
    

    return (
        <section style={{ width: "710px", height: "830px", border: "0.5px solid rgb(210, 210, 210)", borderLeft: "none" }}>
            <div style={{ margin: "30px 0 0 65px", fontSize: "22px", fontWeight: "lighter" }}>
            login activity
            </div>
            <div style={{ margin: "20px 0 0 65px", fontSize: "16px", fontWeight: "600" }}>
            where you are logged in
            </div>
            <div className="mapTab" style={{ margin: "20px 75px 0 65px", display: "flex", padding: "12px 0 0 0", cursor: "pointer" }} onClick={() => { setMapToggle(!mapToggle) }}>
                <GoLocation size={22} />
                <div style={{ marginLeft: "14px", marginTop: "-10px", fontSize: "13px" }}>
                    <div style={{ color: "rgb(135, 194, 108)", fontWeight: "bold", paddingTop: "10px" }}>active now</div>
                </div>
                {
                    mapToggle ? <IoIosArrowDown size={35} style={{ marginLeft: "423px", color: "gray", paddingBottom: "10px" }} />
                        : <IoIosArrowUp size={35} style={{ marginLeft: "423px", color: "gray", paddingBottom: "10px" }} />
                }
            </div>
            <div style={{ margin: "0 75px 0 65px", borderBottom: "1px solid rgb(210, 210, 210)", paddingBottom: "12px" }}>
            </div>
            {
                mapToggle ? <div style={{ border: "1px soild red", margin: "0 75px 0 65px", height: "300px" }}>
                    <Map />
                    <div style={{ border: "1px solid rgb(210, 210, 210)", borderTop: "none", textAlign: "center", cursor: "pointer", height: "55px", paddingTop: "15px" }}
                        onClick={handleLogout}>log out</div>
                    <div style={{ margin: "20px 0 0 0", borderBottom: "1px solid rgb(210, 210, 210)" }}></div>
                </div> : null
            }
        </section>
    )
}

export default LoginActivity
