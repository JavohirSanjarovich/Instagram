import React,{useState,useEffect,useCallback} from 'react'
import {FiMoreHorizontal} from 'react-icons/fi'
import {FaRegPaperPlane} from 'react-icons/fa'
import {AiOutlineHeart,AiFillHeart,AiOutlineSmile} from 'react-icons/ai'
import {MdOutlineChatBubbleOutline} from 'react-icons/md'
import moment from 'moment'; 
import "moment/locale/ko";
import {firestoreService } from '../../../fbase'
import {useSelector} from 'react-redux'
import {RootState} from '../../../redux/_reducers'
import { Modal } from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {FcCheckmark} from 'react-icons/fc'
import { Button } from 'antd'
import SearchShared from '../../common/SearchShared'
import { CopyToClipboard } from "react-copy-to-clipboard";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PostComments from '../../common/PostComments'

interface IProps {
    post:PostType
    allLike:any
    allSavePost:any
}

interface PostType{
    id:string
    commentOff:boolean
    description:string
    fileType:string
    fileUrl:string
    yearMonthDay:string
    hourminutesecond:string
    location:string
    replacedText:string
    user:{
      id:string 
      image:string 
      name:string
    }
    taggedUsers:any[]
    taggedUsersId:string[]
    timestamp: any
  }

interface SaveType{
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

interface LikeType{
    id:string 
    postId:string 
    likeSender:{
        id:string
        name:string
    }
}


function PostCard({post,allLike,allSavePost}:IProps) {
    const [comment,setComment] = useState("")
    const currentUser = useSelector((state:RootState) => state.user.currentUser)
    const [hasLike,setHasLike] = useState(false)
    const [hasSave,setHasSave] = useState(false)
    const [show, setShow] = useState(false);
    const [allComment,setAllComment] = useState<Array<any>>([]);
    const [showModalInPost,setShowModalInPost] = useState(false);
    const [myHeaderModal,setMyHeaderModal] = useState(false)
    const [userHeaderModal,setUserHeaderModal] = useState(false)
    const [postReportModal,setPostReportModal] = useState(false)
    const [followId,setFollowId] = useState("")
    const [modalInReportModal,setModalInReportModal] = useState(false)
    const [sharedModal,setSharedModal] = useState(false)
    const [likeCount,setLikeCount] = useState(0)
    const [taggedUsers,setTaggedUsers] = useState(false)


    const handleCloseModalInPost = useCallback(() => setShowModalInPost(false),[])
    const handleShowModalInPost = useCallback(() => setShowModalInPost(true),[])

    const handleCloseMyHeaderModal = useCallback(() => setMyHeaderModal(false),[])
    const handleShowMyHeaderModal = useCallback(() => setMyHeaderModal(true),[])

    const handleCloseUserHeaderModal = useCallback(() => setUserHeaderModal(false),[])
    const handleShowUserHeaderModal = useCallback(()=> setUserHeaderModal(true),[])
    const handleReportPost =useCallback(()=>{
        handleCloseModalInPost()
        handleCloseUserHeaderModal()
        handleShowReportModal()
    },[])
    const handleCloseReportModal = useCallback(()=>{setPostReportModal(false)},[])
    const handleShowReportModal = useCallback(()=>{setPostReportModal(true)},[])

    const handleCloseModalInReportModal = useCallback(() =>{setModalInReportModal(false)},[])
    const handleShowModalInReportModal = useCallback(()=>{
        handleCloseReportModal()
        setModalInReportModal(true)
    },[])

    const handleCloseSharedModal = useCallback(()=>{setSharedModal(false)},[])
    const handleShowSharedModal = useCallback(()=>{setSharedModal(true)},[])

    const openModal = (post:PostType) => (event: React.MouseEvent) => {setShow(!show)}
    const closeModal = useCallback(() => {setShow(false)},[])

    const handleCloseTaggedUsersModal = useCallback(()=>{setTaggedUsers(false)},[])
    const handleShowTaggedUsersModal = useCallback(() => {
        handleCloseUserHeaderModal()
        handleCloseModalInPost()
        handleCloseMyHeaderModal()
        setTaggedUsers(true)
    }, [])

    useEffect(() => {
        addCommentListeners()
        addLikeListeners()
        addSaveListeners()
        addFollowListeners()
  }, [])

    const addSaveListeners = async () => {
        try {
            await firestoreService.collection(`saves`).doc(currentUser.uid).collection("saves").where("postId", "==", post.id).onSnapshot((snapshot)=>{
                snapshot.docs.length>0 && setHasSave(true)
            })
        } catch (err) {
            console.log(err)
        }
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
    const addFollowListeners = async() =>{
        try {
            await firestoreService.collection("follow").where("fromUserId", "==", currentUser.uid).where("toUserId", "==", post.user.id ).where("follow","==",true).get().then((snapshot) => {
                snapshot.forEach((doc) => {
                    setFollowId(doc.id)
                })
            })
        } catch (err) {
            console.log(err)
        }
    }


    const addCommentListeners = async() => {
        try {
            await firestoreService.collection("comment").orderBy("timestamp").onSnapshot((snapshot) => {
                const commentArray = snapshot.docs.map(doc =>({
                     id: doc.id,
                  ...doc.data()
                }));
                setAllComment(commentArray)
             });
        } catch (err) {
            console.log(err)
        }
    }

    
    const onCommentSubmit = (post: PostType) => (event: React.MouseEvent) => {
        try {
            firestoreService.collection("comment").add(createMessage())
            post.user.id !== currentUser.uid &&  firestoreService.collection("notification").doc(post.user.id).collection("notification").add(createPostCommentNotification())
            toast.info("Comments on this post have been completed")
            setComment("")
        } catch (err) {
            console.log(err)
            toast.info("Comments on this post failed")
            setComment("")
        }
      }

    const createMessage = ()=> {
        const today = new Date()
        const yearMonthDay = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}` 
        const hourminutesecond = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
        const message = {
            timestamp: today,
            content:comment,
            yearMonthDay:yearMonthDay,
            hourminutesecond:hourminutesecond,
            postId:post.id,
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
            postFileType:post.fileType,
            postId:post.id,
            notification:"postComment"
        }
        return notification
    }

    const handleLike = async()=>{
        if(hasLike === false){
            try{
                await firestoreService.collection("likes").add(createLike(post.id))
                post.user.id !== currentUser.uid && await firestoreService.collection("notification").doc(post.user.id).collection("notification").add(createPostLikeNotification())
                toast.info("This post has been liked")
                setHasLike(true)
            }catch(err){
                console.log(err)
                toast.error("Failed to like this post")
            }
        }
        else{
            try{
                allLike.map((like:LikeType)=>{
                    if(like.postId===post.id && like.likeSender.id === currentUser.uid){
                        firestoreService.collection("likes").doc(like.id).delete()
                        toast.error("Unlike this post")
                        setHasLike(false)
                    }
                })
            }
            catch(err){
                toast.error("Failed to unlike this post")
                console.log(err)
            }
        }
    }

    const createLike = (postId:string)=> {
        const like = {
            postId:postId,
            likeSender:{ 
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
            postFileType:post.fileType,
            postId:post.id,
            notification:"postLike"
        }
        return notification
    }
    const handleSave = async() =>{
        if(hasSave === false){
            try{
                await firestoreService.collection("saves").doc(currentUser.uid).collection("saves").add(createSave(post.id))
                toast.info("Post has been saved")
                setHasSave(true)
            }catch(err){
                console.log(err)
                toast.error("Failed to save post")
            }
        }
        else{
            try{
                allSavePost.map((save:SaveType)=>{
                    if(save.postId===post.id && save.saveSender.id === currentUser.uid){
                        firestoreService.collection("saves").doc(currentUser.uid).collection("saves").doc(save.id).delete()
                        toast.error("Canceled saving post")
                        setHasSave(false)
                    }
                })
            }
            catch(err){
                console.log(err)
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


    const handleDeletePost =  async()=>{
        try{
            await firestoreService.collection("posts").doc(post.id).delete()
            allSavePost.map((save:SaveType)=>{
                if(save.postId===post.id && save.saveSender.id === currentUser.uid){
                    firestoreService.collection("saves").doc(currentUser.uid).collection("saves").doc(save.id).delete()
                    toast.error("post has been deleted")
                    setHasSave(false)
                }
            })
            setShow(false)
        }catch(err){
            console.log(err)
            setShow(false)
            toast.error("Post deletion failed")
        }
    }

    const onSubmit = async(e:React.FormEvent)=>{
        e.preventDefault();
        try{
            await firestoreService.collection("comment").add(createMessageInModal(post.id))
            await post.user.id !== currentUser.uid && await firestoreService.collection("notification").doc(post.user.id).collection("notification").add(createPostCommentNotification())
            toast.info("Your comment is complete")
            setComment("")
        }catch(err){
            console.log(err)
            setComment("")
            toast.error("Comment writing failed")
        }
    }

    const createMessageInModal = (postId:string)=> {
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

    const handleCopyPost = ()=>{
        try{
            toast.info("The link has been copied to the clipboard.")
            handleCloseModalInPost()
            handleCloseMyHeaderModal()
            handleCloseUserHeaderModal()
        }
        catch(err:any){
            toast.error(err.message)
        }
    }

    return <article style={{ width: "615px", height: "585px", position: "relative", marginTop: "25px" }}>
        <ToastContainer/>
        <div style={{ height: "70px", backgroundColor: "white", border: "1px solid rgb(210, 210, 210)", borderRadius: "3px", display: "flex" }}>
            {
                currentUser!==null && post.user.id === currentUser.uid ? <Link to="/myprofile"><img src={post.user.image} width={40} height={40} style={{ margin: "15px 0 15px 10px", cursor: "pointer", borderRadius: "100%" }} /></Link>
                    : <Link to={"/profile/" + post.user.id}><img src={post.user.image} width={40} height={40} style={{ margin: "15px 0 15px 10px", cursor: "pointer", borderRadius: "100%" }} /></Link>
            }
            <div>
                {
                    post.location ? <div style={{width:"250px"}}>
                        {
                            currentUser.uid===post.user.id ? <Link to="/myprofile"><div style={{ fontWeight: "bold", color: "rgb(59, 59, 59)", margin: "15px 0 0 13px" }}>{post.user.name}</div></Link>
                            :<Link to={"/profile/" + post.user.id}><div style={{ fontWeight: "bold", color: "rgb(59, 59, 59)", margin: "15px 0 0 13px" }}>{post.user.name}</div></Link>
                        }
                        <div style={{ color: "rgb(59, 59, 59)", margin: "-2px 0 0 13px", fontSize: "12px" }}>{post.location}</div></div>
                        : <>
                        {
                            currentUser.uid===post.user.id ? <Link to="/myprofile"><div style={{ fontWeight: "bold", color: "rgb(59, 59, 59)", margin: "23px 0 0 13px",width:"240px" }}>{post.user.name}</div></Link>
                            : <Link to={"/profile/" + post.user.id}><div style={{ fontWeight: "bold", color: "rgb(59, 59, 59)", margin: "23px 0 0 13px",width:"240px" }}>{post.user.name}</div></Link>
                        }
                        </>
                }
            </div>
            {
                post.user.id===currentUser.uid ? <FiMoreHorizontal size={20} style={{ margin: "20px 0 0 270px", cursor: "pointer" }} onClick={handleShowMyHeaderModal} />
                : <FiMoreHorizontal size={20} style={{ margin: "20px 0 0 270px", cursor: "pointer" }} onClick={handleShowUserHeaderModal} />
            }
        </div>
        {
            post.fileType==="video/mp4" ? <video src={post.fileUrl} style={{ width: "100%" }} controls autoPlay muted loop/>
            :<img src={post.fileUrl} width={615} height={350} />
        }
        <div style={{ height: "150px", backgroundColor: "white", border: "1px solid rgb(210, 210, 210)", borderRadius: "3px" }}>
            <div style={{ height: "90px", borderBottom: "1px solid rgb(235, 235, 235)" }} >
                {
                    hasLike ? <AiFillHeart className="heart" size="25" style={{ margin: "15px 0 0 15px", cursor: "pointer" }} onClick={handleLike}/> :
                        <AiOutlineHeart className="heart" size="25" style={{ margin: "15px 0 0 15px", cursor: "pointer" }} onClick={handleLike}/>
                }
                <MdOutlineChatBubbleOutline className="bubble" size="25" style={{ margin: "15px 0 0 15px", cursor: "pointer" }} onClick={openModal(post)} />
                <FaRegPaperPlane className="paper" size="20"  style={{ margin: "10px 0 0 15px", cursor: "pointer" }} onClick={handleShowSharedModal} />
                {
                    hasSave ? <img src={`${process.env.PUBLIC_URL}/assets/images/save2.png`}  width="22" height="22" style={{margin:"10px 0 0 460px",cursor:"pointer"}} onClick={handleSave}/>
                        : <img src={`${process.env.PUBLIC_URL}/assets/images/save1.png`} width="22" height="22" style={{margin:"10px 0 0 460px",cursor:"pointer"}} onClick={handleSave} />
                }
            </div>
            <div style={{ display: "flex" }}>
                <AiOutlineSmile size={27} style={{ margin: "15px 0 0 15px", cursor: "pointer" }} />
                <input type="text" placeholder="Add a comment..." onChange={(e) => { setComment(e.target.value) }} style={{ margin: "15px 0 0 15px", width: "505px" }} value={comment} />
                {
                    comment ? <button style={{ color: "rgb(30, 140, 230)", backgroundColor: "white", fontWeight: "bold", border: "1px solid white",marginTop:"15px" }}
                        onClick={onCommentSubmit(post)}>posting</button>
                        : <button style={{ color: "rgb(30, 140, 230)", backgroundColor: "white",  fontWeight: "bold" ,border: "1px solid white",opacity:"0.5",marginTop:"15px" }}
                            onClick={onCommentSubmit(post)} disabled>posting</button>
                }
            </div>
        </div>
        <Modal
            className="postModal"
            fullscreen={true}
            style={{ width: "1420px", height: "920px", margin: "25px 0 0 13%", borderRadius: "3px" }}
            size="xl"
            show={show}
            onHide={closeModal}
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
        >
            <main style={{ display: "flex", overflowY: "scroll" }}>
                <section className="fileInPostModalContainer" style={{width:"920px", height: "920px", backgroundColor: "black" }}>
                    {
                        post.fileType === "video/mp4" ? <video className="fileInPostModal" src={post.fileUrl}  controls autoPlay loop  style={{ paddingTop: "200px",width:"920px"}} /> :
                            <img className="fileInPostModal" src={post.fileUrl} style={{ marginTop: "200px",width:"920px",height:"515px" }} />
                    }
                    {
                        <div style={{ fontSize: "13px", display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr', padding: "20px 0 0 20px" }}>
                            {
                                post.taggedUsers && post.taggedUsers.map((user: any) =>
                                    <Link to={"/profile/" + user.id} key={user.id}><div style={{
                                        color: "white", width: "40px", height: "25px",

                                    }} key={user.id}>{user.name}</div></Link>
                                )
                            }
                        </div>
                    }
                </section>
                <aside  style={{ width: "100%", height: "60px" }}>
                    <header style={{ height: "60px", display: "flex", borderBottom: "1px solid rgb(230, 230, 230)", paddingBottom: "15px" }}>
                        {
                            post?.user.id === currentUser.uid ? <Link to="/myprofile"><img src={post.user.image} width={32} height={32} style={{ margin: "15px 0 0 17px", borderRadius: "100%" }} /></Link>
                                : <Link to={"/profile/" + post?.user.id}><img src={post.user.image} width={32} height={32} style={{ margin: "15px 0 0 17px", borderRadius: "100%" }} /></Link>
                        }
                        {
                            post?.user.id === currentUser.uid ? <Link to="/myprofile"><div style={{ margin: "20px 0 0 13px", color: "black",whiteSpace:"nowrap" }}>{post?.user.name}</div></Link>
                                : <Link to={"/profile/" + post?.user.id}><div style={{ margin: "20px 0 0 13px", color: "black",whiteSpace:"nowrap" }}>{post?.user.name}</div></Link>
                        }
                        <FiMoreHorizontal size={20} style={{ margin: "20px 0 0 360px", cursor: "pointer" }} onClick={handleShowModalInPost} />
                    </header>
                    <article className="commentInPostModalContainer" style={{ width: "100%", height: "685px", borderBottom: "1px solid rgb(230, 230, 230)", overflowY: "scroll" }}>
                        {
                            post.description ? <div style={{ height: "60px", display: "flex", margin: "10px 0 10px 0" }}>
                                {
                                    post?.user.id === currentUser.uid ? <Link to="/myprofile"><img src={post?.user.image} width={32} height={32} style={{ margin: "15px 0 0 17px", borderRadius: "100%" }} /></Link>
                                        : <Link to={"/profile/" + post?.user.id}><img src={post?.user.image} width={32} height={32} style={{ margin: "15px 0 0 17px", borderRadius: "100%" }} /></Link>
                                }
                                <div style={{ margin: "10px 0 0 13px" }}>
                                    <div style={{ fontSize: "13px" }}>{
                                        post?.user.id === currentUser.uid ? <Link to="/myprofile"><span style={{ fontWeight: "bold", color: "black" }}>{post?.user.name}&nbsp;</span></Link>
                                            : <Link to={"/profile/" + post?.user.id}><span style={{ fontWeight: "bold", color: "black" }}>{post?.user.name}&nbsp;</span></Link>
                                    }{post?.description}</div>
                                    <span style={{ color: "gray", fontSize: "12px" }}>{moment(`${post.yearMonthDay} ${post.hourminutesecond}`).fromNow()}</span>
                                </div>
                            </div> : null
                        }
                        {
                            allComment.map(comment=>
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
                        <MdOutlineChatBubbleOutline className="bubble" size={26} style={{ marginRight: "15px" }} onClick={openModal(post)} />
                        <FaRegPaperPlane className="paper" size={22} style={{ marginBottom: "5px" }} onClick={handleShowSharedModal}/>
                        <span style={{ cursor: 'pointer' }} onClick={handleSave}>
                            {
                                hasSave ? <img src={`${process.env.PUBLIC_URL}/assets/images/save2.png`} width="22" height="22" style={{ marginLeft: "35%", cursor: "pointer" }}/>
                                    : <img src={`${process.env.PUBLIC_URL}/assets/images/save1.png`} width="22" height="22" style={{ marginLeft: "35%", cursor: "pointer" }}/>
                            }
                        </span>
                        {
                            hasLike ? <div style={{ margin: "10px 0 0 16px" }}><span style={{ fontWeight: "bold" }}>great&nbsp;
                                {likeCount}dog</span></div>
                                : <div style={{ margin: "10px 0 0 16px" }}><span style={{ fontWeight: "bold" }}>great</span>Try pressing</div>
                        }
                        <div style={{margin:"5px 0 0 16px", fontSize: "10px", color: "gray" }}>{moment(`${post.yearMonthDay} ${post.hourminutesecond}`).fromNow()}</div>
                    </div>
                    <footer style={{ margin: "12px 0 0 16px", display: 'flex' }}>
                        <AiOutlineSmile size={27} style={{ marginRight: "13px" }} />
                        <form onSubmit={onSubmit}>
                            <input type="text" placeholder="Add a comment..." onChange={(e) => { setComment(e.target.value) }} value={comment} />
                            <button className="buttonInPostModalContainer" style={{ color: "rgb(30, 140, 230)", marginLeft: "230px", backgroundColor: "white", fontWeight: "bold", border: "1px solid white" }}>posting</button>
                        </form>
                    </footer>
                </aside>
            </main>
            {
                post.user.id === currentUser.uid ? <Modal show={showModalInPost} onHide={handleCloseModalInPost} style={{  margin: '280px 0 0 37%', width: '400px' }}>
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
                        <CopyToClipboard text={`https://instagram-aaebd.web.app/detail-post/${post.id}`}>
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
                </Modal> : <Modal  show={showModalInPost} onHide={handleCloseModalInPost} style={{  margin: '280px 0 0 37%', width: '400px' }}>
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
                        }}>
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

            }
        </Modal>
        <Modal  className="myHeaderModal" show={myHeaderModal} onHide={handleCloseMyHeaderModal} style={{ margin: '280px 0 0 37%', width: '400px' }}>
            <div style={{ borderRadius: "35px" }}>
                <div className='modal1' style={{
                    height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                    textAlign: "center", paddingTop: "15px", cursor: "pointer", color: "red", fontWeight: "bold"
                }} onClick={handleDeletePost}>
                    delete
                </div>
                <Link to={"/detail-post/" + post.id}>
                <div className='modal2' style={{
                    height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                    textAlign: "center", paddingTop: "15px", cursor: "pointer",color:"black"
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
                <CopyToClipboard text={`https://instagram-aaebd.web.app/detail-post/${post.id}`}>
                    <div className="modal4" style={{
                        height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                        textAlign: "center", paddingTop: "15px", cursor: "pointer"
                    }} onClick={handleCopyPost}>Copy link</div>
                </CopyToClipboard>
                <div className='modal5' style={{
                    height: "45px", textAlign: "center", paddingTop: "10px",
                    cursor: "pointer"
                }} onClick={handleCloseMyHeaderModal}>
                    cancel
                </div>
            </div>
        </Modal>
        <Modal className="userHeaderModal" show={userHeaderModal} onHide={handleCloseUserHeaderModal} style={{ margin: '280px 0 0 37%', width: '400px' }}>
            <div style={{ borderRadius: "35px" }}>
                <div className='modal1' style={{
                    height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                    textAlign: "center", paddingTop: "15px", cursor: "pointer", color: "red",fontWeight:"bold"
                }} onClick={handleReportPost}>
                    Declaration
                </div>
                <Link to={"/detail-post/" + post.id}>
                    <div className='modal3' style={{
                        height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                        textAlign: "center", paddingTop: "15px", cursor: "pointer", color: "black"
                    }}>
                        go to post
                    </div>
                </Link>
                <div className='modal4' style={{
                    height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                    textAlign: "center", paddingTop: "15px", cursor: "pointer"
                }} onClick={handleShowTaggedUsersModal}>
                    Tagged Account
                </div>
                <CopyToClipboard text={`https://instagram-aaebd.web.app/detail-post/${post.id}`}>
                    <div className="modal5" style={{
                        height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                        textAlign: "center", paddingTop: "15px", cursor: "pointer"
                    }} onClick={handleCopyPost}>Copy link</div>
                </CopyToClipboard>
                <div className='modal6' style={{
                    height: "45px", textAlign: "center", paddingTop: "10px",
                    cursor: "pointer"
                }} onClick={handleCloseUserHeaderModal}>
                    cancel
                </div>
            </div>
        </Modal>

        <Modal show={postReportModal} onHide={handleCloseReportModal} style={{ width: "400px", margin: "100px 0 0 760px"}}>
            <Modal.Header closeButton style={{ textAlign: "center",paddingLeft:"183px" ,height:"45px" }}>
                <div style={{ textAlign: "center",fontWeight:"bold",fontSize:"16px" }}>Declaration</div>
            </Modal.Header>
            <div>
                <div className='modal3' style={{
                    height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                    padding:"10px 0 0 20px", fontSize:"16px",fontWeight:"bold"
                }} onClick={handleShowModalInReportModal}>
                    Why are you reporting this post
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
            <Modal show={modalInReportModal} onHide={handleCloseModalInReportModal} style={{ margin: '216px 0 0 760px', width: '410px' }}>
                <div style={{ borderRadius: "35px" }}>
                    <div className='modal1' style={{
                        height: "220px", borderBottom: "1px solid rgb(220, 220, 220)",
                        textAlign: "center", paddingTop: "15px", cursor: "pointer"
                    }} >
                        <FcCheckmark size={50}/>
                        <div style={{marginTop:"25px",fontWeight:"bold",fontSize:"15px"}}>thanks for letting me know</div>
                        <div style={{marginTop:"7px",color:"gray"}}>Your valuable comments help keep the Instagram community safe.</div>
                    </div>
                    <div className='modal2' style={{
                        height: "45px", textAlign: "center", paddingTop: "12px",
                        cursor: "pointer",borderBottom: "1px solid rgb(220, 220, 220)"
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
        <Modal show={sharedModal} onHide={handleCloseSharedModal} style={{ marginTop: "100px" }}>
            <SearchShared setSharedModal={setSharedModal} post={post} closeModal={closeModal} />
        </Modal>
        <Modal show={taggedUsers} onHide={handleCloseTaggedUsersModal} style={{ margin: "350px 0 0 760px", width: "390px" }} >
            <Modal.Header closeButton style={{ height: "40px",paddingLeft:"140px" }}>
                <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "16px" }}>Tagged People</div>
            </Modal.Header>
            <Modal.Body>
                {
                    post.taggedUsers && post.taggedUsers.map((user: any) => {
                        if (user.id === currentUser.uid) {
                            return <Link to="myprofile" key={user.id}>
                                <div className="tagUserTab" style={{ display: "flex", cursor: "pointer" }}key={user.id}>
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
    </article>;
}

export default PostCard;