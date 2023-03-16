import React,{useState,useEffect,useCallback} from 'react'
import Navbar from '../../screens/common/Navbar'
import {firestoreService } from '../../fbase'
import { useParams } from 'react-router-dom'
import {AiOutlineHeart,AiOutlineSmile,AiFillHeart} from 'react-icons/ai'
import {FaRegPaperPlane} from 'react-icons/fa'
import moment from 'moment';
import {useSelector} from 'react-redux'
import {RootState} from '../../redux/_reducers'
import { Modal } from 'react-bootstrap'
import SearchShared from '../common/SearchShared'
import PostComments from '../common/PostComments'
import {toast, ToastContainer} from "react-toastify";

interface PostType {
    id:string
    commentOff:boolean
    description:string
    fileType: string 
    fileUrl: string
    yearMonthDay:string
    hourminutesecond:string
    location:string
    replacedText:string
    taggedUsers:any []
    taggedUsersId:string[]
    user:{id:string ,image:string,name:string}
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


function DetailPost() {
    const [posts, setPosts] = useState<Array<PostType>>([]);
    const { id } = useParams<{ id: string }>();
    const [comment, setComment] = useState("")
    const currentUser = useSelector((state: RootState) => state.user.currentUser)
    const [allComment, setAllComment] = useState<Array<any>>([]);
    const [hasLike,setHasLike] = useState(false)
    const [hasSave,setHasSave] = useState(false)
    const [sharedModal,setSharedModal] = useState(false)
    const [allLike,setAllLike] = useState<Array<any>>([]);
    const [allSavePost,setAllSavePost] = useState<Array<any>>([]);

    const handleCloseSharedModal = useCallback(()=>{
        setSharedModal(false)
    },[])
    const handleShowSharedModal = useCallback(()=>{
        setSharedModal(true)
    },[])
    const closeModal = useCallback(() => {
        setHasLike(false)
        setHasSave(false)
    },[])

    useEffect(() => {
        addPostListeners()
        addLikeListeners()
        addSaveListeners()
        addCommentListeners()
    }, [])

    const addPostListeners = async() => {
        const postArray:any[] = []
        try {   
            await firestoreService.collection(`posts`).doc(id).get().then((doc)=>{
                postArray.push(doc.data())
                setPosts(postArray)
            })
        } catch (err) {
            console.log(err)
        }
    }

    const addLikeListeners = async() => {
        try {
            await firestoreService.collection("likes").onSnapshot((snapshot) => {
                setAllLike(snapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data()
                }))
                )
              });
              await firestoreService.collection("likes").where("postId", "==", id).where("likeSender.id", "==", currentUser.uid).get().then((snapshot) => {
                snapshot.docs.length>0 && setHasLike(true)
            })
        } catch (err) {
            console.log(err)
            }
        }
    const addCommentListeners = async() => {
        try {
            await firestoreService.collection("comment").where("postId", "==", id).orderBy("timestamp").onSnapshot((snapshot) => {
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
    const addSaveListeners = async () => {
        try {
            await firestoreService.collection(`saves`).doc(currentUser.uid).collection("saves").onSnapshot((snapshot)=>{
                const saveArray = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAllSavePost(saveArray)
            })
            await firestoreService.collection(`saves`).doc(currentUser.uid).collection("saves").where("postId", "==", id).onSnapshot((snapshot)=>{
                snapshot.docs.length>0 && setHasSave(true)
            })
        } catch (err) {
            console.log(err)
        }
    }

    const onCommentSubmit = async(e:React.FormEvent)=>{
        e.preventDefault();
        try{
            await firestoreService.collection("comment").add(createMessage())
            await posts[0].user.id !== currentUser.uid && await firestoreService.collection("notification").doc(posts[0].user.id).collection("notification").add(createPostCommentNotification())
            allComment.push(createMessage())
            setComment("")
        }catch(err){
            console.log(err)
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
            postId:id,
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
            postFileUrl:posts[0].fileUrl,
            postId:id,
            notification:"postComment"
        }
        return notification
    }

    const handleLike = async () => {
        if (hasLike === false) {
            try {
                await firestoreService.collection("likes").add(createLike(id))
                toast.info("This post has been liked")
                setHasLike(true)
            } catch (err) {
                toast.error("Failed to like this post")
            }
        }
        else {
            try {
            allLike.map((like: LikeType) => {
                if (like.postId === id && like.likeSender.id === currentUser.uid) {
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

    const createLike = (postId:string)=> {
        const like = {
            postId:postId,
            likeSender:{ //보낸사람
                id: currentUser.uid, 
                name: currentUser.displayName
            }
        }
        return like
    }

    const handleSave = async() =>{
        if(hasSave === false){
            try{
                console.log(id)
                await firestoreService.collection("saves").doc(currentUser.uid).collection("saves").add(createSave(id))
                toast.info("Post has been saved")
                setHasSave(true)
            }catch(err){
                toast.error("Failed to save post")
            }
        }
        else{
            try{
                allSavePost.map((save:SaveType)=>{
                    if(save.postId===id && save.saveSender.id === currentUser.uid){
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
            commentOff:posts[0].commentOff,
            replacedText:posts[0].replacedText,
            location:posts[0].location,
            postId:postId,
            fileUrl:posts[0].fileUrl,
            fileType:posts[0].fileType,
            user:posts[0].user,
            description:posts[0].description,
            yearMonthDay:posts[0].yearMonthDay,
            hourminutesecond: posts[0].hourminutesecond,
            taggedUsers:posts[0].taggedUsers,
            saveSender:{ 
                id: currentUser.uid, 
                name: currentUser.displayName
            }
        }
        return save
    }




    
    return <div>
        <Navbar />
        <ToastContainer/>
        {
            posts.map((post) => {
                return <div style={{ width: "935px", height: "753px", border: "1px solid rgb(220,220,220)", margin: "40px 0 0 490px", display: "flex" }} key={post.id}>
                    <div style={{ paddingTop: "60px" }}>
                        {
                            post.fileType === "video/mp4" ? <video src={post.fileUrl} style={{ width: "100%",height:"340px",marginTop:"100px" }} controls />
                                : <img src={post.fileUrl} width={600} height={530} />
                        }
                    </div>
                    <div style={{ borderLeft: "1px solid rgb(220,220,220)",width:"332px" }}>
                        <div style={{ height: "60px", display: "flex", padding: "15px 0 0 15px" }}>
                            <img src={post.user.image} width={35} height={35} style={{ borderRadius: "100%" }} />
                            <div style={{ margin: "5px 0 0 17px", fontWeight: "bold" }}>{post.user.name}</div>
                        </div>
                        <div className="postCommentContainer"style={{ borderTop: "1px solid rgb(220,220,220)", height: "530px",width:"330px", overflowY: "scroll", overflowX: "scroll" }}>
                            {
                                post.description ? <div style={{ height: "60px", display: "flex", margin: "10px 0 10px 0" }}>
                                    <img src={post.user.image} width={32} height={32} style={{ margin: "15px 0 0 17px", borderRadius:"100%"}} />
                                <div style={{ margin: "10px 0 0 13px" }}>
                                <div style={{fontSize:"13px"}}><span style={{ fontWeight: "bold"}}>{post?.user.name}&nbsp;</span>{post?.description}</div>
                                    <span style={{ color: "gray", fontSize: "12px" }}>{moment(`${post.yearMonthDay} ${post.hourminutesecond}`).fromNow()}</span>
                                </div>
                            </div> : null
                            }
                            {
                                allComment.map(comment =>
                                    <PostComments comment={comment} key={comment.id} />
                                )
                            }
                        </div>
                        <div style={{ borderTop: "1px solid rgb(220,220,220)", height: "110px", paddingTop: "10px" }}>
                            {
                                hasLike ? <AiFillHeart className="heart" size={29} style={{ margin: "0 15px", cursor:"pointer"  }} onClick={handleLike}/> :
                                    <AiOutlineHeart className="heart" size={29} style={{ margin: "0 15px",cursor:"pointer"  }} onClick={handleLike} />
                            }
                            <FaRegPaperPlane className="paper" size={22} style={{ marginBottom: "5px",cursor:"pointer"  }} onClick={handleShowSharedModal} />
                            {
                                hasSave ? <img src={`${process.env.PUBLIC_URL}/assets/images/save2.png`} width="22" height="22" style={{ marginLeft: "210px",cursor:"pointer" }} onClick={handleSave}/>
                                : <img src={`${process.env.PUBLIC_URL}/assets/images/save1.png`} width="22" height="22" style={{ marginLeft: "210px",cursor:"pointer"  }} onClick={handleSave}/>
                            }
                            {
                                hasLike ? <div style={{ margin: "10px 0 0 16px" }}> <span style={{ fontWeight: "bold" }}>great&nbsp;
                                    {allLike && (allLike.filter(like => like.postId === id)).length}Like</span></div>
                                    : <div style={{ margin: "10px 0 0 16px" }}><span style={{ fontWeight: "bold" }}>great</span>Try pressing</div>
                            }
                            {/* <div style={{ margin: "5px 0 0 16px", fontSize: "10px", color: "gray" }}>{moment(`${post.yearMonthDay} ${post.hourminutesecond}`).fromNow()}</div> */}
                        </div>
                        <div style={{borderTop: "1px solid rgb(220,220,220)",display: 'flex' , padding:"10px 0 0 15px" }}>
                            <AiOutlineSmile size={27}  />
                            <form onSubmit={onCommentSubmit} style={{padding:"4px 0 0 15px"}}>
                                <input type="text" placeholder="Add a comment..." onChange={(e) => { setComment(e.target.value) }} value={comment} style={{width:"225px"}} />
                                <button style={{ color: "rgb(30, 140, 230)", backgroundColor: "white", fontWeight: "bold", border: "1px solid white"}}>posting</button>
                            </form>
                        </div>
                    </div>
                </div>
            })
        }
        <Modal show={sharedModal} onHide={handleCloseSharedModal} style={{ marginTop: "100px" }}>
            <SearchShared setSharedModal={setSharedModal} post={posts[0]} closeModal={closeModal} />
        </Modal>
    </div>;
}

export default DetailPost;
