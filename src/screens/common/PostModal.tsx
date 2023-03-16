import React, { useState ,useEffect,useCallback} from 'react'
// import { Modal } from 'react-bootstrap'
import  Modal  from 'react-bootstrap/Modal'
import { FaRegPaperPlane } from 'react-icons/fa'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { MdOutlineChatBubbleOutline } from 'react-icons/md'
import { AiOutlineSmile } from 'react-icons/ai'
import { FiMoreHorizontal } from 'react-icons/fi'
import moment from 'moment';
// import "moment/locale/en-US";
// import "moment-locale-en-us";
import { Link } from "react-router-dom"
import { CopyToClipboard } from "react-copy-to-clipboard";
import { firestoreService } from '../../fbase';
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// import { Button } from 'antd'
import  Button  from 'antd/lib/button'
import {FcCheckmark} from 'react-icons/fc'
import PostComments from './PostComments'


interface Save{
    id:string
    commentOff:boolean
    description:string
    fileType:string
    fileUrl:string
    hourminutesecond:string
    yearMonthDay:string
    location:string
    postId:string
    replacedText:string 
    saveSender:{
        id:string 
        name:string
    }
    user:{
        id:string 
        image:string 
        name:string    
    }
    taggedUsers:any
}

interface Like{
    id:string 
    postId:string 
    likeSender:{
        id:string
        name:string
    }
}


function PostModal({post,allComment,allSavePosts,allLike,currentUser,handleShowSharedModal,closeModal }: any) {
    const [comment, setComment] = useState("")
    const [likeCount,setLikeCount] = useState(0)
    const [hasLike,setHasLike] = useState(false)
    const [hasSave,setHasSave] = useState(false)
    const [showModalInPost,setShowModalInPost] = useState(false);
    const [modalInReportModal, setModalInReportModal] = useState(false)
    const [postReportModal, setPostReportModal] = useState(false)
    const [taggedUsers,setTaggedUsers] = useState(false)

    const handleCloseModalInPost = useCallback(() => setShowModalInPost(false),[])
    const handleShowModalInPost = useCallback(() => setShowModalInPost(true),[])
    const handleShowReportModal = useCallback(()=>setPostReportModal(true),[])
    const handleCloseReportModal = useCallback(()=>setPostReportModal(false),[])
    
    const handleReportPost = useCallback(() => {
        handleCloseModalInPost() 
        handleShowReportModal()
    },[])
    const handleShowModalInReportModal = useCallback(()=>{
        handleCloseReportModal()
        setModalInReportModal(true)
    },[])
    const handleCloseModalInReportModal = useCallback(() =>{setModalInReportModal(false)},[])


    const handleCloseTaggedUsersModal = useCallback(() => { setTaggedUsers(false) }, [])
    const handleShowTaggedUsersModal = useCallback(() => {
        handleCloseModalInPost()
        setTaggedUsers(true)
    }, [])

    useEffect(() => {
        addLikeListeners()
        addSaveListeners()
    }, [])

    const addSaveListeners = async() => {
        await firestoreService.collection(`saves`).doc(currentUser.uid).collection("saves").where("postId", "==", post.id).onSnapshot((snapshot)=>{
            snapshot.docs.length>0 && setHasSave(true)
        })
    }
    const addLikeListeners = async() => {
        try {
            await firestoreService.collection("likes").where("postId", "==", post.id).get().then((snapshot) => {
                setLikeCount(snapshot.docs.length)
            })
            await firestoreService.collection("likes").where("postId", "==", post.id).where("likeSender.id", "==", currentUser.uid).get().then((snapshot) => {
                snapshot.docs.length>0 && setHasLike(true)
            })
        } catch (err) {
            console.log(err)
        }
    }
    const onSubmit = async(e:React.FormEvent)=>{
        e.preventDefault();
        try{
            await firestoreService.collection("comment").add(createMessage(post.id))
            await post.user.id !== currentUser.uid && await firestoreService.collection("notification").doc(post.user.id).collection("notification").add(createPostCommentNotification())
            toast.info("Comments on this post have been completed")
            setComment("")
        }catch(err){
            toast.info("Comments on this post failed")
            setComment("")
        }
    }
    const createMessage = (postId:string)=> {
        const today = new Date()
        const yearMonthDay = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}` 
        const hourminutesecond = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
        const message = {
            timestamp: today,
            content:comment,
            yearMonthDay:yearMonthDay,
            hourminutesecond:hourminutesecond,
            postId:postId,
            writer:{
                id: currentUser.uid,
                name: currentUser.displayName,
                image: currentUser.photoURL
            }
        }
        return message
    }
    const createPostCommentNotification = () => {
        const notification = {
            fromUserName:currentUser.displayName,
            fromUserId:currentUser.uid,
            fromUserImg:currentUser.photoURL,
            postFileUrl:post.fileUrl,
            postId:post.id,
            postFileType:post.fileType,
            notification:"postComment"
        }
        return notification
    }

    const handleSave = async() =>{
        if(hasSave === false){
            try{
                await firestoreService.collection("saves").doc(currentUser.uid).collection("saves").add(createSave(post.id))
                console.log(post.id)
                toast.info("Post has been saved")
                setHasSave(true)
            }catch(err){
                toast.error("Failed to save post")
            }
        }
        else{
            try{
                allSavePosts.map((save:Save)=>{
                    if(save.postId===post.id && save.saveSender.id === currentUser.uid){
                        firestoreService.collection("saves").doc(currentUser.uid).collection("saves").doc(save.id).delete()
                        toast.error("Canceled saving post")
                        setHasSave(false)
                    }
                })

            }
            catch(err){
                toast.error("Failed to cancel post save")
            }
        }
    }
    const createSave = (postId:string) =>{
        const save = {
            commentOff:post?.commentOff,
            replacedText:post?.replacedText,
            location:post?.location,
            postId:postId,
            fileUrl:post?.fileUrl,
            fileType:post?.fileType,
            user:post?.user,
            description:post?.description,
            yearMonthDay:post?.yearMonthDay,
            hourminutesecond: post?.hourminutesecond,
            taggedUsers:post?.taggedUsers,
            saveSender:{ 
                id: currentUser.uid, 
                name: currentUser.displayName
            }
        }
        return save
    }

    const handleLike = async() => {
        if (hasLike === false) {
            try {
                await firestoreService.collection("likes").add(createLike(post.id))
                post.user.id !== currentUser.uid && await firestoreService.collection("notification").doc(post.user.id).collection("notification").add(createPostLikeNotification())
                toast.info("This post has been liked")
                setHasLike(true)
            } catch (err) {
                toast.error("Failed to like this post")
            }
        }
        else {
            try {
                allLike.map((like:Like) => {
                    if (like.postId === post.id && like.likeSender.id === currentUser.uid) {
                        firestoreService.collection("likes").doc(like.id).delete()
                        toast.error("Unlike this post")
                        setHasLike(false)
                    }
                })
            }
            catch (err) {
                toast.error("Failed to unlike this post")
            }
        }
    }

    const createLike = (postId: string) => {
        const like = {
            postId: postId,
            likeSender: { 
                id: currentUser.uid,
                name: currentUser.displayName
            }
        }
        return like
    }

    const createPostLikeNotification = () => {
        const notification = {
            fromUserName:currentUser.displayName,
            fromUserId:currentUser.uid,
            fromUserImg:currentUser.photoURL,
            postFileUrl:post.fileUrl,
            postId:post.id,
            postFileType:post.fileType,
            notification:"postLike"
        }
        return notification
    }

    const handleDeletePost =  async()=>{
        try{
            await firestoreService.collection("posts").doc(post.id).delete()
            allSavePosts.map((save:Save)=>{
                if(save.postId===post.id && save.saveSender.id === currentUser.uid){
                    firestoreService.collection("saves").doc(currentUser.uid).collection("saves").doc(save.id).delete()
                    setHasSave(false)
                }
            })
            toast.info("Post has been deleted")
            closeModal()
        }catch(err){
            toast.error("Post deletion failed")
            closeModal()        
        }
    }

    const handleCopyPost = useCallback(() => {
        try {
            toast.info("The link has been copied to the clipboard.")
            handleCloseModalInPost()
        }
        catch (err: any) {
            toast.error(err.message)
        }
    },[])
    
    return <>
        <main style={{ display: "flex", overflowY: "scroll" }}>
            <section className="fileInPostModalContainer" style={{ width: "920px", height: "920px", backgroundColor: "black" }}>
                {
                    post?.fileType === "video/mp4" ? <video className="fileInPostModal" src={post?.fileUrl} width={920} autoPlay loop style={{ paddingTop: "200px" }} /> :
                        <img className="fileInPostModal" src={post?.fileUrl} height={515} width={920} style={{ marginTop: "200px" }} />
                }
                {
                    post.taggedUsers &&
                    <div style={{ fontSize: "13px", display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr', padding: "20px 0 0 20px" }}>
                        {
                            post.taggedUsers.map((user: any) => {
                                if (user.id === currentUser.uid) {
                                    return <Link to="myprofile" key={user.id}><div style={{
                                        color: "white", width: "40px", height: "25px"
                                    }} key={user.id}>{user.name}</div></Link>
                                }
                                else {
                                    return <Link to={"/profile/" + user.id} key={user.id}><div style={{
                                        color: "white", width: "40px", height: "25px"
                                    }} key={user.id}>{user.name}</div></Link>
                                }
                            }

                            )
                        }
                    </div>
                }
            </section>
            <aside style={{ width: "100%", height: "60px" }}>
                <header style={{ height: "60px", display: "flex", borderBottom: "1px solid rgb(230, 230, 230)", paddingBottom: "15px" }}>
                    {
                        post?.user.id===currentUser.uid ?<Link to="/myprofile"><img src={post?.user.image} width={32} height={32} style={{ margin: "15px 0 0 17px", borderRadius: "100%" }} /></Link>
                        :<Link to={"/profile/" + post?.user.id}><img src={post?.user.image} width={32} height={32} style={{ margin: "15px 0 0 17px", borderRadius: "100%" }} /></Link>
                    }
                    {
                        post?.user.id===currentUser.uid ?<Link to="/myprofile"><div style={{ margin: "20px 0 0 13px",color:"black",whiteSpace:"nowrap" }}>{post?.user.name}</div></Link>
                        : <Link to={"/profile/" + post?.user.id}><div style={{ margin: "20px 0 0 13px", color: "black",whiteSpace:"nowrap" }}>{post?.user.name}</div></Link>
                    }
                    <FiMoreHorizontal size={20} style={{ margin: "20px 0 0 360px", cursor: "pointer" }} onClick={handleShowModalInPost} />
                </header>
                <article className="commentInPostModalContainer" style={{ width: "100%", height: "685px", borderBottom: "1px solid rgb(230, 230, 230)", overflowY: "scroll" }}>
                    {
                        post?.description ? <div style={{ height: "60px", display: "flex", margin: "10px 0 10px 0" }}>
                            {
                                post?.user.id === currentUser.uid ? <Link to="/myprofile"><img src={post?.user.image} width={32} height={32} style={{ margin: "15px 0 0 17px", borderRadius: "100%" }} /></Link>
                                    : <Link to={"/profile/" + post?.user.id}><img src={post?.user.image} width={32} height={32} style={{ margin: "15px 0 0 17px", borderRadius: "100%" }} /></Link>
                            }
                            <div style={{ margin: "10px 0 0 13px" }}>
                                <div style={{ fontSize: "13px" }}>{
                                    post?.user.id === currentUser.uid ? <Link to="/myprofile"><span style={{ fontWeight: "bold",color:"black" }}>{post?.user.name}&nbsp;</span></Link>
                                        : <Link to={"/profile/" + post?.user.id}><span style={{ fontWeight: "bold",color:"black"  }}>{post?.user.name}&nbsp;</span></Link>
                                }{post?.description}</div>
                                <span style={{ color: "gray", fontSize: "12px" }}>{moment(`${post?.yearMonthDay} ${post?.hourminutesecond}`).fromNow()}</span>
                            </div>
                        </div> : null
                    }
                    {
                        allComment.map((comment: any) =>
                            comment.postId === post.id &&
                                <PostComments comment={comment} key={comment.id} post={post}/>
                        )
                    }
                </article>
                <div style={{ height: "90px", margin: "15px 0 0 0", borderBottom: "1px solid rgb(230, 230, 230)" }}>
                    <span style={{ cursor: 'pointer' }} onClick={handleLike}>
                        {
                            hasLike ? <AiFillHeart className="heart" size={29} style={{ marginRight: "15px", marginLeft: "15px" }} /> :
                                <AiOutlineHeart className="heart" size={29} style={{ marginRight: "15px", marginLeft: "15px" }} />
                        }
                    </span>
                    <MdOutlineChatBubbleOutline className="bubble" size={26} style={{ marginRight: "15px" }} onClick={closeModal} />
                    <FaRegPaperPlane className="paper" size={22} style={{ marginBottom: "5px" }} onClick={handleShowSharedModal} />
                    <span style={{ cursor: 'pointer' }} onClick={handleSave}>
                        {
                            hasSave ? <img src={`${process.env.PUBLIC_URL}/assets/images/save2.png`} width="22" height="22"style={{ marginLeft: "340px", cursor: "pointer" }} />
                                : <img src={`${process.env.PUBLIC_URL}/assets/images/save1.png`} width="22" height="22" style={{ marginLeft: "340px", cursor: "pointer" }} />
                        }
                    </span>
                    {
                        hasLike ? <div style={{ margin: "10px 0 0 16px" }}><span style={{ fontWeight: "bold" }}>great&nbsp;
                            {likeCount}dog</span></div>
                            : <div style={{ margin: "10px 0 0 16px" }}><span style={{ fontWeight: "bold" }}>great</span>Try pressing</div>
                    }
                </div>
                <footer style={{ margin: "12px 0 0 16px", display: 'flex' }}>
                    <AiOutlineSmile size={27} style={{ marginRight: "13px" }} />
                    <form onSubmit={onSubmit}>
                        <input type="text" placeholder="Add a comment..." onChange={(e) => { setComment(e.target.value) }} value={comment} />
                        <button style={{ color: "rgb(30, 140, 230)", marginLeft: "230px", backgroundColor: "white", fontWeight: "bold", border: "1px solid white" }}>posting</button>
                    </form>
                </footer>
            </aside>
        </main>
        {
            post.user.id ===currentUser.uid ? <Modal className="modal" show={showModalInPost} onHide={handleCloseModalInPost} style={{ marginTop: '310px', marginLeft: '760px', width: '400px' }}>
            <div style={{ borderRadius: "35px" }}>
                <div className='modal1' style={{
                    height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                    textAlign: "center", paddingTop: "15px", cursor: "pointer", color: "red", fontWeight: "bold"
                }} onClick={handleDeletePost}>
                    삭제
                </div>
                <Link to={"/detail-post/" + post.id}>
                    <div className='modal2' style={{
                        height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                        textAlign: "center", paddingTop: "15px", cursor: "pointer", color: "black"
                    }}>
                        go to post
                    </div>
                </Link>
                <div className='modal3' style={{
                    height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                    textAlign: "center", paddingTop: "15px", cursor: "pointer"
                }} onClick={handleShowTaggedUsersModal}>
                    Tagged Account
                </div>
                <CopyToClipboard text={`http://instagram-aaebd.web.app/detail-post/${post.id}`}>
                    <div className="modal4" style={{
                        height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                        textAlign: "center", paddingTop: "15px", cursor: "pointer"
                    }} onClick={handleCopyPost}>Copy link</div>
                </CopyToClipboard>
                <div className='modal5' style={{
                    height: "45px", textAlign: "center", paddingTop: "10px",
                    cursor: "pointer"
                }} onClick={handleCloseModalInPost}>
                    cancel
                </div>
            </div>
        </Modal>
        : 
                <>
                    <Modal className="modal" show={showModalInPost} onHide={handleCloseModalInPost} style={{ marginTop: '310px', marginLeft: '760px', width: '400px' }}>
                        <div style={{ borderRadius: "35px" }}>
                            <div className='modal1' style={{
                                height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                                textAlign: "center", paddingTop: "15px", cursor: "pointer", color: "red", fontWeight: "bold"
                            }} onClick={handleReportPost}>
                                Declaration
                            </div>
                            <div className='modal3' style={{
                                height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                                textAlign: "center", paddingTop: "15px", cursor: "pointer"
                            }}>
                                go to post
                            </div>
                            <div className='modal4' style={{
                                height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                                textAlign: "center", paddingTop: "15px", cursor: "pointer"
                            }} onClick={handleShowTaggedUsersModal}>
                                Tagged Account
                            </div>
                            <div className='modal5' style={{
                                height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                                textAlign: "center", paddingTop: "15px", cursor: "pointer"
                            }}onClick={handleCopyPost}>
                                Copy link
                            </div>
                            <div className='modal6' style={{
                                height: "45px", textAlign: "center", paddingTop: "10px",
                                cursor: "pointer"
                            }} onClick={handleCloseModalInPost}>
                                cancel
                            </div>
                        </div>
                    </Modal>
                    <Modal show={postReportModal} onHide={handleCloseReportModal} style={{ width: "400px", margin: "100px 0 0 760px" }}>
                        <Modal.Header closeButton style={{ textAlign: "center", paddingLeft: "183px", height: "45px" }}>
                            <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "16px" }}>Declaration</div>
                        </Modal.Header>
                        <div>
                            <div className='modal3' style={{
                                height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                                padding: "10px 0 0 20px", fontSize: "16px", fontWeight: "bold"
                            }} onClick={handleShowModalInReportModal}>
                                Why are you reporting this post
                            </div>
                            <div className='modal4' style={{
                                height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                                padding: "10px 0 0 20px", cursor: "pointer"
                            }} onClick={handleShowModalInReportModal}>
                                spam
                            </div>
                            <div className='modal5' style={{
                                height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                                padding: "10px 0 0 20px", cursor: "pointer"
                            }} onClick={handleShowModalInReportModal}>
                                nudity or sexual misconduct
                            </div>
                            <div className='modal6' style={{
                                height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                                padding: "10px 0 0 20px", cursor: "pointer"
                            }} onClick={handleShowModalInReportModal}>
                                Hate Speech or Symbols
                            </div>
                            <div className='modal7' style={{
                                height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                                padding: "10px 0 0 20px", cursor: "pointer"
                            }} onClick={handleShowModalInReportModal}>
                                violent or dangerous group
                            </div>
                            <div className='modal3' style={{
                                height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                                padding: "10px 0 0 20px", cursor: "pointer"
                            }} onClick={handleShowModalInReportModal}>
                                Selling illegal or regulated goods
                            </div>
                            <div className='modal4' style={{
                                height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                                padding: "10px 0 0 20px", cursor: "pointer"
                            }} onClick={handleShowModalInReportModal}>
                                bullying or bullying
                            </div>
                            <div className='modal5' style={{
                                height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                                padding: "10px 0 0 20px", cursor: "pointer"
                            }} onClick={handleShowModalInReportModal}>
                                intellectual property infringement
                            </div>
                            <div className='modal6' style={{
                                height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                                padding: "10px 0 0 20px", cursor: "pointer"
                            }} onClick={handleShowModalInReportModal}>
                                suicide or self harm
                            </div>
                            <div className='modal7' style={{
                                height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                                padding: "10px 0 0 20px", cursor: "pointer"
                            }} onClick={handleShowModalInReportModal}>
                                eating disorder
                            </div>
                            <div className='modal7' style={{
                                height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                                padding: "10px 0 0 20px", cursor: "pointer"
                            }} onClick={handleShowModalInReportModal}>
                                scam or lies
                            </div>
                            <div className='modal7' style={{
                                height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                                padding: "10px 0 0 20px", cursor: "pointer"
                            }} onClick={handleShowModalInReportModal}>
                                false information
                            </div>
                            <div className='modal7' style={{
                                height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                                padding: "10px 0 0 20px", cursor: "pointer"
                            }} onClick={handleShowModalInReportModal}>
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
                                <FcCheckmark size={50} />
                                <div style={{ marginTop: "25px", fontWeight: "bold", fontSize: "15px" }}>thanks for letting me know</div>
                                <div style={{ marginTop: "7px", color: "gray" }}>Your valuable comments help keep the Instagram community safe.</div>
                            </div>
                            <div className='modal3' style={{
                                height: "45px", textAlign: "center", paddingTop: "12px",
                                cursor: "pointer", borderBottom: "1px solid rgb(220, 220, 220)"
                            }} >
                                <a href="https://help.instagram.com/477434105621119" target='_blank'>learn more</a>
                            </div>
                            <div className='modal3' style={{
                                height: "60px", textAlign: "center", paddingTop: "12px",
                                cursor: "pointer"
                            }} onClick={handleCloseModalInReportModal}>
                                <Button type="primary" style={{ width: "370px" }}>close</Button>
                            </div>
                        </div>
                    </Modal>
                </>
        }
        <Modal show={taggedUsers} onHide={handleCloseTaggedUsersModal} style={{ margin: "350px 0 0 760px", width: "390px" }} >
            <Modal.Header closeButton style={{ height: "40px", paddingLeft: "140px" }}>
                <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "16px" }}>Tagged People</div>
            </Modal.Header>
            <Modal.Body>
                {
                    post.taggedUsers && post.taggedUsers.map((user: any) => {
                        if (user.id === currentUser.uid) {
                            return <Link to="myprofile" key={user.id}>
                                <div className="tagUserTab" style={{ display: "flex", cursor: "pointer" }}  key={user.id}>
                                    <img src={user.image} width={40} height={40} style={{ margin: "0 0 10px 2px", borderRadius: "100%" }} />
                                    <div style={{ fontWeight: "bold", color: "rgb(59, 59, 59)", margin: "6px 0 0 12px" }}>{user.name}</div>
                                </div>
                            </Link>
                        }
                        else {
                            return <Link to={`profile/${user.id}`}>
                                <div className="tagUserTab" style={{ display: "flex", cursor: "pointer" }}>
                                    <img src={user.image} width={40} height={40} style={{ margin: "0 0 10px 2px", borderRadius: "100%" }} />
                                    <div style={{ fontWeight: "bold", color: "rgb(59, 59, 59)", margin: "6px 0 0 12px" }}>{user.name}</div>
                                </div>
                            </Link>
                        }
                    }
                    )
                }
            </Modal.Body>
        </Modal>
    </>;
}

<img src="" alt="" />


export default PostModal;
