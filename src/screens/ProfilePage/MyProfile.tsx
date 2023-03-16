import React,{useState,useEffect,useRef,useCallback} from 'react'
import { Button } from 'antd';
import { Link } from "react-router-dom";
import {BsInfoCircle} from  'react-icons/bs'
import {Modal} from 'react-bootstrap'
import { authService ,storageService,databaseService} from '../../fbase'
import "antd/dist/antd.css";
import {AiOutlineTable,AiFillTag} from 'react-icons/ai'
import {RiVideoLine} from 'react-icons/ri'
import {HiOutlinePhotograph} from'react-icons/hi'
import Navbar from '../common/Navbar'
import Post from './MyprofileComponent/Post'
import Save from './MyprofileComponent/Save'
import Video from './MyprofileComponent/Video'
import Tag from './MyprofileComponent/Tag'
import {useSelector,useDispatch} from 'react-redux'
import {RootState} from '../../redux/_reducers'
import {firestoreService} from '../../fbase'
import {setPhotoURL,setCurrentChatRoom,userEditProfile} from "../../redux/_actions/user_actions"
import {useHistory} from "react-router-dom"
import { ToastContainer,toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



interface FollowerType{
    id:string
    follow?: boolean
    fromUserId?: string
    fromUserImg?: string
    fromUserName?: string
    img?: string
    toUserId?: string
    toUserName?: string
}
interface followUserType{
    id:string
    follow?: boolean
    fromUserId?: string
    fromUserImg?: string
    fromUserName?: string
    img?: string
    toUserId?: string
    toUserName?: string
}


function MyprofilePage() {
    const history = useHistory()
    const dispatch = useDispatch()
    const currentUser = useSelector((state: RootState) => state.user.currentUser)
    const currentUserProfile = useSelector((state: RootState) => state.user.currentUserProfile)
    const profileImgUploadRef = useRef<HTMLInputElement>(null);
    const [followers,setFollowers] = useState<Array<FollowerType>>([]);
    const [followUsers,setFollowUsers] = useState<Array<followUserType>>([]);
    const [tab, setTab] = useState(0)
    const [postCount, setPostCount] = useState(0)
    const [followCount , setFollowCount] = useState(0)
    const [follwerCount,setFollowerCount] = useState(0)
    const [show, setShow] = useState(false);
    const [showFollowerModal,setShowFollowerModal] = useState(false)
    const [showFollowModal,setShowFollowModal] = useState(false)




    const handleClose = useCallback(() => setShow(false),[])
    const handleShow = useCallback(() => setShow(true),[])
    const handleCloseFollowerModal = useCallback(()=>setShowFollowerModal(false),[])
    const handleShowFollowerModal = useCallback(()=>setShowFollowerModal(true),[])
    const handleCloseFollowModal = useCallback(()=>setShowFollowModal(false),[])
    const handleShowFollowModal = useCallback(()=>setShowFollowModal(true),[])


    const handleLogout = () => { 
        try{
            authService.signOut()
            history.push('/login')
        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        addPostListeners()
        addFollowListeners()
        addChatRoomListeners()
        addUserProfileListeners()
    }, [])


    const addPostListeners = async() => {
        try {
            await firestoreService.collection("posts").where("user.id", "==", currentUser.uid).get().then((snapshot) => {
                setPostCount(snapshot.docs.length)
            })
        } catch (err) {
            console.log(err)
        }
    }
    const addFollowListeners = async() => {
        try {
            await firestoreService.collection("follow").where("toUserId", "==", currentUser.uid).onSnapshot((snapshot) => {
                setFollowerCount(snapshot.docs.length)
                const followerArray = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setFollowers(followerArray)
            })
            await firestoreService.collection("follow").where("fromUserId", "==", currentUser.uid).onSnapshot((snapshot) => {
                setFollowCount(snapshot.docs.length)
                const followArray = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setFollowUsers(followArray)
            })
        } catch (err) {
            console.log(err)
        }
    }

    const addChatRoomListeners = async () => {
        try {
          await firestoreService.collection(`message`).where("fromUserId", "==", currentUser.uid).onSnapshot((snapshot) => {
            const messageArray = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            if (messageArray.length === 0) {
              addChatRoomListeners2()
            }
            dispatch(setCurrentChatRoom(messageArray[0]))
          })
        } catch (err) {
          console.log(err)
        }
    }
      const addChatRoomListeners2 = async () => {
        try {
          await firestoreService.collection(`message`).where("toUserId", "==", currentUser.uid).onSnapshot((snapshot) => {
            const messageArray = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            dispatch(setCurrentChatRoom(messageArray[0]))
          })
        } catch (err) {
          console.log(err)
        }
    }
    const addUserProfileListeners = async() => {
        try {
            await firestoreService.collection(`profile`).doc(currentUser.uid).onSnapshot((doc) => {
                const profile = doc.data()
                dispatch(userEditProfile(profile))
              })
        } catch (err) {
          console.log(err)
        }
      }

    const ChangeProfileImg = useCallback(()=>{
        profileImgUploadRef.current && profileImgUploadRef.current.click()
    },[])
    
    const handleProfileImgUploadFile = async (event: { target: HTMLInputElement }) => {
        if (event.target.files) {
            const file = event.target.files[0]
            const metadata = { contentType: file.type }         
            try {
                let uploadTaskSnapshot =  await storageService.ref().child(`profileImg/${currentUser.uid}/${file.name}`).put(file, metadata)  
                let downloadURL =  await uploadTaskSnapshot.ref.getDownloadURL() 
                authService.currentUser?.updateProfile({
                    photoURL: downloadURL
                })
                dispatch(setPhotoURL(downloadURL)) 
                databaseService.ref("users").child(currentUser.uid).update({image:downloadURL})
                toast.info("Your profile image has been changed")
            } catch (err) {
                console.log(err)
                toast.error("Profile image change failed")
            }

        }
    }
    return (
        <>
            <main style={{minHeight:"850px"}}>
            <ToastContainer/>
                <Navbar />
                <section className="profile_container" style={{display:"flex",justifyContent:"center",alignItems:"center" ,marginTop: '30px'}}>
                    <div style={{width:"930px",display:"flex"}}>
                    <div  style={{ height: '200px', width: '260px',cursor:"pointer"}} onClick={ChangeProfileImg}>
                        <img src={currentUser && currentUser.photoURL} width={150} height={150} style={{borderRadius:"70%"}} />
                        <input type="file" ref={profileImgUploadRef} onChange={handleProfileImgUploadFile} style={{ display: "none" }} />
                    </div>
                    <div  style={{ height: '200px', width: '300px' }}>
                        <span style={{ fontSize: '25px', fontWeight: 'lighter' }}>{currentUser && currentUser.displayName}</span>
                        <Button className="profile_button" style={{ marginLeft: '15px' }}><Link to="/myprofile-setting">Edit Profile</Link></Button>
                        <BsInfoCircle style={{ cursor: 'pointer', marginLeft: '15px' }} size={25} onClick={handleShow} />
                        <p style={{ fontSize: '17px', marginTop: '15px' }}>post {postCount}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <span style={{cursor:"pointer"}}onClick={handleShowFollowerModal}>followers {follwerCount}</span> 
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{cursor:"pointer"}}onClick={handleShowFollowModal}>follow {followCount}</span></p>
                        <div style={{ marginLeft: "3px" }}>
                            <div style={{ fontWeight: "bold",marginBottom: "5px"}}>{currentUserProfile && currentUserProfile.profile.username}</div>
                            <div style={{ marginBottom: "5px"}}>{currentUserProfile &&currentUserProfile.profile.introduction}</div>
                            <a style={{color:"rgb(42, 95, 173)",fontWeight:"bold"}}href={currentUserProfile &&currentUserProfile.profile.webSite} target='_blank'>{currentUserProfile &&currentUserProfile.profile.webSite}</a>
                        </div>
                    </div>
                    </div>
                </section>
                <section>
                <div style={{ height: '50px', width: '930px', margin: 'auto', borderTop: '1px solid rgb(200, 200, 200)', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ cursor: 'pointer', height: '30px', width: '100px', marginTop: '15px', marginLeft: '15px', fontSize: '13px' }} onClick={()=>{setTab(0)}}><AiOutlineTable />&nbsp;post</div>
                    <div style={{ cursor: 'pointer', height: '30px', width: '100px', marginTop: '15px', marginLeft: '10px', fontSize: '13px' }} onClick={() => {setTab(1)}}><RiVideoLine size={15} />&nbsp;video</div>
                    <div style={{ cursor: 'pointer', height: '30px', width: '100px', marginTop: '15px', marginLeft: '15px', fontSize: '13px' }} onClick={() => { setTab(2) }}><HiOutlinePhotograph size={15} />&nbsp;saved</div>
                    <div style={{ cursor: 'pointer', height: '30px', width: '100px', marginTop: '15px', marginLeft: '10px', fontSize: '13px' }} onClick={() => { setTab(3) }}><AiFillTag size={15} />&nbsp;tagged</div>
                </div>
                {
                    tab === 0 ? <Post/> :
                        tab === 1 ? <Video/> :
                            tab === 2 ? <Save /> :
                                <Tag />
                }
                </section>
                <Modal className="modal" show={show} onHide={handleClose} style={{ marginTop: '230px', marginLeft: '750px', width: '390px' }}>
                        <div style={{ borderRadius: "35px" }}>
                        <Link style={{ color: "black" }} to="/myprofile-setting">
                        <div className='modal1' style={{
                            height: "45px", borderBottom: "1px solid rgb(200, 200, 200)",
                            textAlign: "center", paddingTop: "10px", cursor: "pointer"
                        }}>Change Password</div>
                        <div className='modal2' style={{
                            height: "45px", borderBottom: "1px solid rgb(200, 200, 200)",
                            textAlign: "center", paddingTop: "10px", cursor: "pointer"
                        }}>Apps and Websites</div>
                        <div className='modal3' style={{
                            height: "45px", borderBottom: "1px solid rgb(200, 200, 200)",
                            textAlign: "center", paddingTop: "10px", cursor: "pointer"
                        }}>alarm</div>
                        <div className='modal4' style={{
                            height: "45px", borderBottom: "1px solid rgb(200, 200, 200)",
                            textAlign: "center", paddingTop: "10px", cursor: "pointer"
                        }}>Privacy and Security</div>
                        <div className='modal5' style={{
                            height: "45px", borderBottom: "1px solid rgb(200, 200, 200)",
                            textAlign: "center", paddingTop: "10px", cursor: "pointer"
                        }}>login activity</div>
                        <div className='modal6' style={{
                            height: "45px", borderBottom: "1px solid rgb(200, 200, 200)",
                            textAlign: "center", paddingTop: "10px", cursor: "pointer"
                        }}>email from instagram</div>
                        </Link>
                        <div className='modal7' style={{
                            height: "45px", borderBottom: "1px solid rgb(200, 200, 200)",
                            textAlign: "center", paddingTop: "10px", cursor: "pointer"
                        }} onClick={handleLogout}>log out</div>
                        <div className='modal8' style={{ height: "45px", textAlign: "center", paddingTop: "10px", cursor: "pointer" }} onClick={handleClose}>cancel</div>
                    </div>
                </Modal>
                <Modal show={showFollowerModal} onHide={handleCloseFollowerModal}style={{ margin: "240px 0 0 750px",width:"410px" }}>
                    <Modal.Header closeButton>
                        <div style={{ padding: "0 0 20px 165px", fontSize: "17px", fontWeight: "bold", height: "0px", }}>followers</div>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={{overflowY:"scroll"}}>
                            {
                                followers.map((user) => <div style={{marginBottom:"15px"}} key={user.id}>
                                    <Link to={"/profile/" + user.fromUserId}><img src={user.fromUserImg} width={30} height={30}style={{ borderRadius: "100%" }}/></Link>
                                    <span style={{ marginLeft: "10px", color: "gray" }}>{user.fromUserName}</span>
                                </div>)
                            }
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal show={showFollowModal} onHide={handleCloseFollowModal}style={{ margin: "240px 0 0 750px",width:"410px" }}>
                    <Modal.Header closeButton>
                        <div style={{ padding: "0 0 20px 165px", fontSize: "17px", fontWeight: "bold", height: "0px", }}>follow</div>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={{overflowY:"scroll"}}>
                            {
                                followUsers.map((user) => <div style={{marginBottom:"15px"}} key={user.id}>
                                    <Link to={"/profile/" + user.toUserId}><img src={user.img} width={30} height={30}style={{ borderRadius: "100%" }}/></Link>
                                    <span style={{ marginLeft: "10px", color: "gray" }}>{user.toUserName}</span>
                                </div>)
                            }
                        </div>
                    </Modal.Body>
                </Modal>
            </main>
        </>
    )
}

export default MyprofilePage



