import React,{useState,useEffect,useCallback} from 'react'
import {firestoreService} from '../../../fbase'
import {useSelector} from 'react-redux'
import {RootState} from '../../../redux/_reducers'
import { Modal } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import PostModal from '../../common/PostModal';
import SearchShared from '../../common/SearchShared'


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
    timestamp?: any
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
    const [posts, setPosts] =  useState<Array<any>>([]);
    const { id } = useParams<{ id: string }>();
    const currentUser = useSelector((state:RootState) => state.user.currentUser)
    const [show, setShow] = useState(false);
    const [allComment,setAllComment] = useState<Array<CommentType>>([]);
    const [allLike,setAllLike] = useState<Array<LikeType>>([]);
    const [sharedModal, setSharedModal] = useState(false)



    const handleCloseSharedModal = useCallback(()=>{ setSharedModal(false)},[])
    const handleShowSharedModal = useCallback(()=>{setSharedModal(true)},[])

    useEffect(() => {
        addPostListeners()
        addCommentListeners()
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
        console.log(posts)
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

    const openModal = (post:PostType)=>(event:React.MouseEvent) =>{
        setShow(true)
        setPost(post)
    }

    const closeModal = useCallback(()=>{
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
    },[])

    const rederPostCard = (posts: PostType[]) =>
        posts.map(post => {
            if(post.user.id===id){
                switch (post.fileType) {
                    case "video/mp4": {
                        return <div style={{width: "290px", height: "300px",position:"relative",cursor:"pointer",backgroundColor:"rgb(202, 199, 199)"}} onClick={openModal(post)} key={post.id}>
                            <div className="imgOverLay"></div>
                            <video src={post.fileUrl} style={{width: "100%",height:"100%",objectFit:"fill"}} />
                        </div>
                    }
                }
            }
        }
        )
    return (
        <>
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
                <PostModal post={post} allComment={allComment} allLike={allLike} closeModal={closeModal}
                    currentUser={currentUser} handleShowSharedModal={handleShowSharedModal} />
            </Modal>
            <Modal show={sharedModal} onHide={handleCloseSharedModal} style={{ marginTop: "100px" }}>
                <SearchShared setSharedModal={setSharedModal} post={post} closeModal={closeModal} />
            </Modal>
        </>
    )
}

export default Video


