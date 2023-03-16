import React,{useState,useEffect} from 'react'
import {firestoreService} from '../../../fbase'
import {useSelector} from 'react-redux'
import {RootState} from '../../../redux/_reducers'
import { Modal } from 'react-bootstrap'
import SearchShared from '../../common/SearchShared'
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PostModal from '../../common/PostModal';
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
    taggedUsersId :string[]
    user:{id:string ,image:string,name:string}
    timestamp?: any
}

interface SaveType {
    id: string
    commentOff?: boolean
    description?: string
    fileType?: string
    fileUrl?: string
    yearMonthDay?: string
    hourminutesecond?: string
    location?: string
    postId?: string
    replacedText?: string
    saveSender?: {name: string, id: string}
    taggedUsers?: any[]
    user?: {id: string, image:string, name:string}
}
interface CommentType {
    id: string
    content?: string
    yearMonthDay?: string
    hourminutesecond?: string
    postId?: string
    timestamp?:{nanoseconds:number,seconds:number}
    writer?:{id:string,image:string,name:string}
}
interface LikeType {
    id: string
    likeSender?:{id:string,name:string}
    postId?: string
}

function Video() {
    const [post, setPost] = useState<PostType>()
    const [posts, setPosts] = useState<Array<any>>([]);
    const currentUser = useSelector((state:RootState) => state.user.currentUser)
    const [show, setShow] = useState(false);
    const [allComment,setAllComment] = useState<Array<CommentType>>([]);
    const [allLike,setAllLike] = useState<Array<LikeType>>([]);
    const [allSavePosts, setAllSavePosts] = useState<Array<SaveType>>([]);
    const [sharedModal,setSharedModal] = useState(false)
    const handleCloseSharedModal = ()=>{ setSharedModal(false)}
    const handleShowSharedModal = ()=>{setSharedModal(true)}


    useEffect(() => {
        addPostListeners()
        addCommentListeners()
        addLikeListeners()
        addSaveListeners()
    }, [])

    
    const addPostListeners = async() => {
        await firestoreService.collection("posts").onSnapshot((snapshot) => {
            setPosts(
                snapshot.docs.map((doc)=>({
                    id:doc.id,
                    ...doc.data()
                }))
            )
        });
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


    const addLikeListeners = async() => {
        try {
            await firestoreService.collection("likes").onSnapshot((snapshot) => {
                const likeArray = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAllLike(likeArray)
            });
        } catch (err) {
            console.log(err)
        }
    }

    const addSaveListeners = async() => {

        await firestoreService.collection(`saves`).doc(currentUser.uid).collection("saves").onSnapshot((snapshot)=>{
            const saveArray = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAllSavePosts(saveArray)
        })
    }

    const openModal = (post:PostType)=>(event:React.MouseEvent) =>{
        setShow(!show)
        setPost(post)
    }

    const closeModal = ()=>{
        setShow(false)
        setPost({
            id:"",
            commentOff:false,
            description:"",
            fileType: "",
            fileUrl: "",
            yearMonthDay:"",
            hourminutesecond:"",
            location:"",
            replacedText:"",
            taggedUsers:[],
            taggedUsersId :[],
            user:{id:"" ,image:"",name:""}
        })
    }


    const rederPostCard = (posts: PostType[]) =>
        posts.map(post => {
            if (post.user.id === currentUser.uid) {
                switch (post.fileType) {
                    case "video/mp4": {
                        return <div style={{ width: "290px", height: "300px", position: "relative", cursor: "pointer", backgroundColor: "rgb(202, 199, 199)" }} onClick={openModal(post)} key={post.id}>
                            <div className="imgOverLay"></div>
                            <video src={post.fileUrl} style={{ width: "100%", height: "100%",objectFit:"fill" }} />
                        </div>
                    }
                }
            }
        })
    return (
        <>
            <ToastContainer />
            <article style={{ width: '930px', margin: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', rowGap: '30px', columnGap: '30px' }} >
                {rederPostCard(posts)}
            </article>
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
                <PostModal post={post} allComment={allComment} allSavePosts={allSavePosts} allLike={allLike} closeModal={closeModal}
                    currentUser={currentUser} handleShowSharedModal={handleShowSharedModal} />
            </Modal>
            <Modal show={sharedModal} onHide={handleCloseSharedModal} style={{ marginTop: "100px" }}>
                <SearchShared setSharedModal={setSharedModal} post={post} closeModal={closeModal} />
            </Modal>
        </>
    )
}

export default Video


