import React,{useCallback} from 'react'
import { Link } from "react-router-dom";
import {useSelector} from 'react-redux'
import {RootState} from '../../redux/_reducers'

interface NotificationType {
    id: string
    fromUserId: string
    fromUserImg: string
    fromUserName: string
    notification: string
    postFileType: string
    postFileUrl: string
    postId: string
}
interface IProps {
    setShowNotificationBox:(parameter:boolean)=>void
}



function Notification({ setShowNotificationBox }: IProps) {
    const notification = useSelector((state: RootState) => state.user.notification)
    const handleCloseNotificationBox = useCallback((e) => {
        setShowNotificationBox(false)
    }, [])
    return (
        <div className='notificationBox' style={{
            backgroundColor: "white", position: "absolute", top: "50px", right: "5px", width: "495px", height: "340px", zIndex: "10",
            border: "0.5px solid rgb(235, 235, 235)", borderRadius: "5px", overflowY: "scroll"
        }} onMouseLeave={handleCloseNotificationBox}>
            {notification.map((noti: NotificationType) =>{
                if (noti.notification==="follow"){
                    return <div style={{ display: "flex", color: "black", margin: "15px 0 0 15px" }}>
                         <Link to={"/profile/" + noti.fromUserId}><img src={noti.fromUserImg} width={50} height={50} style={{ borderRadius: "100%" }} /></Link>
                        <div style={{ margin: "10px 0 0 10px" }}><span style={{ fontWeight: "bold" }}>{noti.fromUserName}</span>started following you.</div>
                     </div> 
                }
                else if(noti.notification === "postLike"){
                    if(noti.postFileType === "video/mp4"){
                        return <div style={{ display: "flex", color: "black", margin: "15px 0 0 15px" }}>
                        <Link to={"/profile/" + noti.fromUserId}><img src={noti.fromUserImg} width={50} height={50} style={{ borderRadius: "100%" }} /></Link>
                        <div style={{ margin: "10px 0 0 10px" }}><span style={{ fontWeight: "bold" }}>{noti.fromUserName}</span>likes your post.</div>
                        <Link to={"/detail-post/" + noti.postId}><video src={noti.postFileUrl} width={50} height={40} style={{ marginLeft: "80px" }} /></Link>
                    </div>
                    }
                    else{
                        return <div style={{ display: "flex", color: "black", margin: "15px 0 0 15px" }}>
                        <Link to={"/profile/" + noti.fromUserId}><img src={noti.fromUserImg} width={50} height={50} style={{ borderRadius: "100%" }} /></Link>
                        <div style={{ margin: "10px 0 0 10px" }}><span style={{ fontWeight: "bold" }}>{noti.fromUserName}</span>likes your post.</div>
                        <Link to={"/detail-post/" + noti.postId}><img src={noti.postFileUrl} width={50} height={40} style={{ marginLeft: "80px" }} /></Link>
                    </div>
                    }
                }
                else if(noti.notification === "postComment"){
                    if(noti.postFileType === "video/mp4"){
                        return <div style={{ display: "flex", color: "black", margin: "15px 0 0 15px" }}>
                        <Link to={"/profile/" + noti.fromUserId}><img src={noti.fromUserImg} width={50} height={50} style={{ borderRadius: "100%" }} /></Link>
                        <div style={{ margin: "10px 0 0 10px" }}><span style={{ fontWeight: "bold" }}>{noti.fromUserName}</span>left a comment on your post</div>
                        <Link to={"/detail-post/" + noti.postId}><video src={noti.postFileUrl} width={50} height={40} style={{ marginLeft: "35px" }} /></Link>
                    </div>
                    }
                    else{
                        return <div style={{ display: "flex", color: "black", margin: "15px 0 0 15px" }}>
                        <Link to={"/profile/" + noti.fromUserId}><img src={noti.fromUserImg} width={50} height={50} style={{ borderRadius: "100%" }} /></Link>
                        <div style={{ margin: "10px 0 0 10px" }}><span style={{ fontWeight: "bold" }}>{noti.fromUserName}</span>left a comment on your post</div>
                        <Link to={"/detail-post/" + noti.postId}><img src={noti.postFileUrl} width={50} height={40} style={{ marginLeft: "35px" }} /></Link>
                    </div>
                    }
                }
                else if(noti.notification === "commentLike"){
                    if(noti.postFileType === "video/mp4"){
                        return <div style={{ display: "flex", color: "black", margin: "15px 0 0 15px" }}>
                        <Link to={"/profile/" + noti.fromUserId}><img src={noti.fromUserImg} width={50} height={50} style={{ borderRadius: "100%" }} /></Link>
                        <div style={{ margin: "10px 0 0 10px" }}><span style={{ fontWeight: "bold" }}>{noti.fromUserName}</span>likes your comment.</div>
                        <Link to={"/detail-post/" + noti.postId}><video src={noti.postFileUrl} width={50} height={40} style={{ marginLeft: "95px" }} /></Link>
                    </div>
                    }
                    else{
                        return <div style={{ display: "flex", color: "black", margin: "15px 0 0 15px" }}>
                        <Link to={"/profile/" + noti.fromUserId}><img src={noti.fromUserImg} width={50} height={50} style={{ borderRadius: "100%" }} /></Link>
                        <div style={{ margin: "10px 0 0 10px" }}><span style={{ fontWeight: "bold" }}>{noti.fromUserName}</span>likes your comment.</div>
                        <Link to={"/detail-post/" + noti.postId}><img src={noti.postFileUrl} width={50} height={40} style={{ marginLeft: "95px" }} /></Link>
                    </div>
                    }
                }
                else if(noti.notification === "replyComment"){
                    if(noti.postFileType === "video/mp4"){
                        return <div style={{ display: "flex", color: "black", margin: "15px 0 0 15px" }}>
                        <Link to={"/profile/" + noti.fromUserId}><img src={noti.fromUserImg} width={50} height={50} style={{ borderRadius: "100%" }} /></Link>
                        <div style={{ margin: "10px 0 0 10px" }}><span style={{ fontWeight: "bold" }}>{noti.fromUserName}</span>You left a comment on a member's comment.</div>
                        <Link to={"/detail-post/" + noti.postId}><video src={noti.postFileUrl} width={50} height={40} style={{ marginLeft: "33px" }} /></Link>
                    </div>
                    }
                    else{
                        return <div style={{ display: "flex", color: "black", margin: "15px 0 0 15px" }}>
                        <Link to={"/profile/" + noti.fromUserId}><img src={noti.fromUserImg} width={50} height={50} style={{ borderRadius: "100%" }} /></Link>
                        <div style={{ margin: "10px 0 0 10px" }}><span style={{ fontWeight: "bold" }}>{noti.fromUserName}</span>You left a comment on a member's comment.</div>
                        <Link to={"/detail-post/" + noti.postId}><img src={noti.postFileUrl} width={50} height={40} style={{ marginLeft: "33px" }} /></Link>
                    </div>
                    }
                }
            }
            )}
        </div>
    )
}

export default Notification