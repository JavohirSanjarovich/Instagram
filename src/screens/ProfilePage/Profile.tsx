import React,{useEffect,useState,useCallback} from 'react';
import { useParams } from 'react-router-dom'
import Navbar from '../common/Navbar'
import { Button } from 'antd';
import {databaseService,firestoreService} from '../../fbase'
import "antd/dist/antd.css";
import {FiMoreHorizontal} from 'react-icons/fi'
import {AiOutlineTable,AiFillTag} from 'react-icons/ai'
import {RiVideoLine} from 'react-icons/ri'
import Post from './ProfileComponent/Post'
import {RootState} from '../../redux/_reducers'
import {useSelector,useDispatch} from 'react-redux'
import {BsPersonCheck} from 'react-icons/bs'
import {Modal} from 'react-bootstrap'
import {useHistory} from 'react-router-dom'
import {setCurrentChatRoom} from '../../redux/_actions/user_actions'
import {FcCheckmark} from 'react-icons/fc'
import Video from './ProfileComponent/Video'
import Tag from './ProfileComponent/Tag'
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface User{
    id:string 
    image:string 
    name:string 
}




function Profile() {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<Array<any>>([]);
    const [userProfile,setUserProfile] = useState<Array<string>>([]);
    const [tab, setTab] = useState(0)
    const [postsCount, setPostsCount] = useState(0)
    const [followCount , setFollowCount] = useState(0)
    const [follwerCount,setFollowerCount] = useState(0)
    const currentUser = useSelector((state: RootState) => state.user.currentUser)
    const [followDone, setFollowDone] = useState(false)
    const [unFollowModal, setUnFollowModal] = useState(false)
    const [followId, setFollowId] = useState("")
    const [reportAndBlockModal, setReportAndBlockModal] = useState(false)
    const [userReportModal, setUserReportModal] = useState(false)
    const [modalInReportModal, setModalInReportModal] = useState(false)
    const history = useHistory()
    const dispatch = useDispatch()

    const handleCloseUnFollowModal = useCallback(() => setUnFollowModal(false),[])
    const handleShowUnFollowModal = useCallback(() => setUnFollowModal(true),[])
    const handleCloseReportAndBlockModal = useCallback(() =>setReportAndBlockModal(false),[])
    const handleShowReportAndBlockModal = useCallback(()=>setReportAndBlockModal(true),[])
    const handleReportPost = useCallback(() => {
        handleShowUserReportModal()
        handleCloseReportAndBlockModal()
     },[])
    const handleShowUserReportModal = useCallback(()=>{setUserReportModal(true)},[])
    const handleCloseUserReportModal = useCallback(()=>{setUserReportModal(false)},[])
    const handleShowModalInReportModal = useCallback(()=>{
        handleCloseUserReportModal()
        setModalInReportModal(true)
    },[])
    const handleCloseModalInReportModal = useCallback(() =>{setModalInReportModal(false)},[])


    useEffect(() => {
        addUserListeners()
        addPostListeners()
        addUserProfileListeners()
        addFollowListeners()
        return () => {
            databaseService.ref("users").off()
          };
  }, [])

  const addUserListeners = async() => {    
    try {
        const usersArray: User[] = [];
        await databaseService.ref("users").child(id).on("child_added", DataSnapshot => {
            if(typeof DataSnapshot.val() === "string" ){
                usersArray.push(DataSnapshot.val())
                setUser(usersArray)
            }          
        })
    } catch (err) {
        console.log(err)
    }
}


    const addPostListeners = async() => {
        try {
            await firestoreService.collection("posts").where("user.id", "==", id).get().then((snapshot) => {
                setPostsCount(snapshot.docs.length)
            })
        } catch (err) {
            console.log(err)
        }
    }
    const addUserProfileListeners = async() => {    
        try {
            const usersProfileArray: string[] = [];
            await databaseService.ref("users").child(id).child("profile").on("child_added", DataSnapshot => {
                usersProfileArray.push(DataSnapshot.val())
                setUserProfile(usersProfileArray) 
            })
        } catch (err) {
            console.log(err)
        }
    }

    const addFollowListeners = async() =>{
        try {
            await firestoreService.collection("follow").where("fromUserId", "==", currentUser.uid).where("toUserId", "==", id ).where("follow","==",true).get().then((snapshot) => {
                if(snapshot.docs.length>0){
                    setFollowDone(true)
                }
                snapshot.forEach((doc) => {
                    setFollowId(doc.id)
                })
            })
            await firestoreService.collection("follow").where("fromUserId", "==", id).onSnapshot((snapshot) => {
                setFollowCount(snapshot.docs.length)
            })
            await firestoreService.collection("follow").where("toUserId", "==", id).onSnapshot((snapshot) => {
                setFollowerCount(snapshot.docs.length)
            })
        } catch (err) {
            console.log(err)
        }
    }

    const handleFollow = async()=>{
        try{
            await firestoreService.collection("follow").add(createFollowForm(id))
            await databaseService.ref("users").child(id).child(currentUser.uid).push().set({follow:true}) 
            await firestoreService.collection("notification").doc(id).collection("notification").add(createFollowNotification())
            setFollowDone(true)
            toast.info("Successfully followed the user")
        }catch(err){
            console.log(err)
            toast.error("Failed to follow the user")
        }
    }

    const createFollowForm = (id:string) => {
        const follow = {
            fromUserName:currentUser.displayName,
            fromUserId:currentUser.uid,
            fromUserImg:currentUser.photoURL,
            toUserName:user[2],
            toUserId:id,
            follow:true,
            img:user[1]
        }
        return follow
    }
    const createFollowNotification = () => {
        const notification = {
            fromUserName:currentUser.displayName,
            fromUserId:currentUser.uid,
            fromUserImg:currentUser.photoURL,
            notification:"follow"
        }
        return notification
    }
    

    const handleUnFollow = async() => {
        try {
            await firestoreService.collection("follow").doc(followId).delete()
            await databaseService.ref("users").child(id).child(currentUser.uid).remove()
            setFollowDone(false)
            handleCloseUnFollowModal()
            toast.error("Unfollowed user")
        } catch (err) {
            console.log(err)
            toast.error("Failed to unfollow the user")
        }
    }




    const handleSendMessage = async()=>{
        try{
            const chatRoomId = currentUser.uid > id ? `${currentUser.uid}${id}`
            : `${id}${currentUser.uid}`
            await firestoreService.collection('message').doc(chatRoomId).set(createMessage(chatRoomId))
            dispatch(setCurrentChatRoom(createMessage(chatRoomId)))
            history.push("/direct-message")
        }catch(err){
            console.log(err)
        }
    }

    const createMessage = (ChatRoomid:string)=>{
        const message={
            fromUserId:currentUser.uid,
            fromUserName:currentUser.displayName,
            fromUserImg:currentUser.photoURL,
            toUserId:id,
            toUserName:user[2],
            toUserImg:user[1],
            chatRoomId:ChatRoomid
        }
        return message
    }
    return (
        <main style={{minHeight:"850px"}}>
            <Navbar />
            <ToastContainer/>
            <section className="profile_container" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: '30px' }}>
                <div style={{ width: "930px", display: "flex" }}>
                    <div style={{ height: '200px', width: '260px',cursor:"pointer" }} >
                        <img src={user[1]} width={150} height={150} style={{ borderRadius: "70%" }} />
                    </div>
                    <div style={{ height: '200px', width: '300px', marginTop: "15px" }}>
                        <span style={{ fontSize: '25px', fontWeight: 'lighter' }}>{user[2]}</span>
                        {
                            followDone ? <span><button  style={{
                                marginLeft: '15px', fontWeight: "bold", width: "110px", height: "30px", top: "-3px"
                                , paddingLeft: "10px", borderRadius: "5px",border: "1px solid rgb(216, 214, 214)",backgroundColor:"white"
                            }} onClick={handleSendMessage}>send message</button>
                                <BsPersonCheck size={25} style={{ margin: "-12px 0 0 15px", cursor: "pointer" }} onClick={handleShowUnFollowModal} /></span> :
                                <Button className='follow_btn'  type="primary" style={{
                                    marginLeft: '20px', width: "65px", borderRadius: "5px", paddingLeft: "12px"
                                    , fontWeight: "bold"
                                }} onClick={handleFollow}>follow</Button>
                        }
                        <FiMoreHorizontal size={25} style={{ margin: "-5px 0 0 20px", cursor: "pointer" }} onClick={handleShowReportAndBlockModal} />
                        <div style={{ fontSize: '17px', marginTop: '20px' }}>post{postsCount}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;followers {follwerCount}
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;follow {followCount}</div>
                        <div style={{ fontWeight: "bold", margin: "10px 0 5px 0" }}>{userProfile[4]}</div>
                        <div style={{ marginBottom: "5px" }}>{userProfile[2]}</div>
                        <a style={{ color: "rgb(42, 95, 173)", fontWeight: "bold" }} href={userProfile[5]} target='_blank'>{userProfile[5]}</a>
                    </div>
                </div>
            </section>
            <section>
            <div style={{ height: '50px', width: '930px', margin: 'auto', borderTop: '1px solid rgb(200, 200, 200)', display: 'flex', justifyContent: 'center' }}>
                <div style={{ cursor: 'pointer', height: '30px', width: '100px', marginTop: '15px', marginLeft: '15px', fontSize: '13px' }} onClick={()=>{setTab(0)}}><AiOutlineTable />&nbsp;post</div>
                    <div style={{ cursor: 'pointer', height: '30px', width: '100px', marginTop: '15px', marginLeft: '10px', fontSize: '13px' }} onClick={() => {setTab(1)}}><RiVideoLine size={15} />&nbsp;video</div>
                    <div style={{ cursor: 'pointer', height: '30px', width: '100px', marginTop: '15px', marginLeft: '10px', fontSize: '13px' }} onClick={() => {setTab(2)}}><AiFillTag size={15} />&nbsp;tagged</div>
            </div>
            {
                tab === 0 ? <Post key={user && user[0]} /> :
                    tab === 1 ? <Video key={user && user[0]} /> :
                        <Tag key={user && user[0]} />
            }
            </section>
            <Modal show={unFollowModal} onHide={handleCloseUnFollowModal} style={{ marginTop: '310px', marginLeft: '760px', width: '400px' }}>
                <div style={{ borderRadius: "35px" }}>
                    <div className='modal1' style={{
                        height: "200px", borderBottom: "1px solid rgb(220, 220, 220)",
                        textAlign: "center", paddingTop: "15px", cursor: "pointer"
                    }} >
                        <img src={user[1]} width={90} height={90} style={{borderRadius:"70%",marginTop:"18px"}} />
                        <div style={{marginTop:"25px"}}>{user[2]}Are you sure you want to unfollow</div>
                    </div>
                    <div className='modal2' style={{
                        height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                        textAlign: "center", paddingTop: "12px", cursor: "pointer",color:"red", fontWeight: "bold"
                    }} onClick={handleUnFollow}>
                        unfollow
                    </div>
                    <div className='modal3' style={{
                        height: "45px", textAlign: "center", paddingTop: "12px",
                        cursor: "pointer"
                    }} onClick={handleCloseUnFollowModal}>
                        cancel
                    </div>
                </div>
            </Modal>
            <Modal show={reportAndBlockModal} onHide={handleCloseReportAndBlockModal} style={{ marginTop: '360px', marginLeft: '760px', width: '400px' }}>
                <div style={{ borderRadius: "35px" }}>
                    <div className='modal1' style={{
                        height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                        textAlign: "center", paddingTop: "12px", cursor: "pointer",color:"red", fontWeight: "bold"
                    }} onClick={handleReportPost}>
                        Report user
                    </div>
                    <div className='modal2' style={{
                        height: "47px", textAlign: "center", paddingTop: "12px",
                        cursor: "pointer"
                    }} onClick={handleCloseReportAndBlockModal}>
                        cancel
                    </div>
                </div>
            </Modal>
            <Modal show={userReportModal} onHide={handleCloseUserReportModal} style={{ width: "400px", margin: "100px 0 0 760px" }}>
                    <Modal.Header closeButton style={{ textAlign: "center", paddingLeft: "183px", height: "45px" }}>
                        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "16px" }}>Declaration</div>
                    </Modal.Header>
                    <div>
                        <div className='modal3' style={{
                            height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                            padding: "10px 0 0 20px", fontSize: "16px", fontWeight: "bold"
                        }} onClick={handleShowModalInReportModal}>
                    Reasons for reporting this user
                </div>
                <div className='modal4' style={{
                    height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                    padding:"10px 0 0 20px", cursor: "pointer"
                }}onClick={handleShowModalInReportModal}>
                    spam
                </div>
                <div className='modal5' style={{
                    height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                    padding:"10px 0 0 20px", cursor: "pointer"
                }}onClick={handleShowModalInReportModal}>
                    nudity or sexual misconduct
                </div>
                <div className='modal6' style={{
                    height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                    padding:"10px 0 0 20px", cursor: "pointer"
                }}onClick={handleShowModalInReportModal}>
                    Hate Speech or Symbols
                </div>
                <div className='modal7' style={{
                    height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                    padding:"10px 0 0 20px", cursor: "pointer"
                }}onClick={handleShowModalInReportModal}>
                    violent or dangerous group
                </div>
                <div className='modal3' style={{
                    height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                    padding:"10px 0 0 20px", cursor: "pointer"
                }}onClick={handleShowModalInReportModal}>
                    Selling illegal or regulated goods
                </div>
                <div className='modal4' style={{
                    height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                    padding:"10px 0 0 20px", cursor: "pointer"
                }}onClick={handleShowModalInReportModal}>
                    bullying or bullying
                </div>
                <div className='modal5' style={{
                    height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                    padding:"10px 0 0 20px", cursor: "pointer"
                }}onClick={handleShowModalInReportModal}>
                    intellectual property infringement
                </div>
                <div className='modal6' style={{
                    height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                    padding:"10px 0 0 20px", cursor: "pointer"
                }}onClick={handleShowModalInReportModal}>
                    suicide or self harm
                </div>
                <div className='modal7' style={{
                    height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                    padding:"10px 0 0 20px", cursor: "pointer"
                }}onClick={handleShowModalInReportModal}>
                    eating disorder
                </div>
                <div className='modal7' style={{
                    height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                    padding:"10px 0 0 20px", cursor: "pointer"
                }}onClick={handleShowModalInReportModal}>
                    scam or lie
                </div>
                <div className='modal7' style={{
                    height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                    padding:"10px 0 0 20px", cursor: "pointer"
                }}onClick={handleShowModalInReportModal}>
                    false information
                </div>
                <div className='modal7' style={{
                    height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                    padding:"10px 0 0 20px", cursor: "pointer"
                }}onClick={handleShowModalInReportModal}>
                    don't like it
                </div>
            </div>
        </Modal>
        <Modal show={modalInReportModal} onHide={handleCloseModalInReportModal} style={{ marginTop: '230px', marginLeft: '760px', width: '410px' }}>
                <div style={{ borderRadius: "35px" }}>
                    <div className='modal1' style={{
                        height: "220px", borderBottom: "1px solid rgb(220, 220, 220)",
                        textAlign: "center", paddingTop: "15px", cursor: "pointer"
                    }} >
                        <FcCheckmark size={50}/>
                        <div style={{marginTop:"25px",fontWeight:"bold",fontSize:"15px"}}>thanks for letting me know</div>
                        <div style={{marginTop:"7px",color:"gray"}}>Your valuable comments help keep the Instagram community safe.</div>
                    </div>
                    <div className='modal3' style={{
                        height: "45px", textAlign: "center", paddingTop: "12px",
                        cursor: "pointer",borderBottom: "1px solid rgb(220, 220, 220)"
                    }} >
                        <a href="https://help.instagram.com/477434105621119" target='_blank'>learn more</a>
                    </div>
                    <div className='modal3' style={{
                        height: "60px", textAlign: "center", paddingTop: "12px",
                        cursor: "pointer"
                    }} onClick={handleCloseModalInReportModal}>
                        <Button type="primary" style={{width:"370px"}}>close</Button>
                    </div>
                </div>
            </Modal>
        </main>
    )
}

export default Profile;
