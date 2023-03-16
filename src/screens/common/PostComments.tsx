import React, { useState,useEffect, useCallback } from 'react';
import moment from 'moment';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { firestoreService } from '../../fbase';
import {useSelector} from 'react-redux'
import {RootState} from '../../redux/_reducers'
import { AiOutlineSmile } from 'react-icons/ai'
import { Modal } from 'react-bootstrap'
import {Link} from 'react-router-dom'



interface replyCommentType {
  content?: string
  yearMonthDay?:string
  hourminutesecond?: string
  id: string
  timestamp?: {nanoseconds:number,seconds:number}
  writer?:{id:string,image:string,name:string}
}

interface LikeType {
  id: string
  image?:string
  name?:string
}

function PostComments({post,comment}:any) {

  const [hasLike,setHasLike] = useState(false)
  const [likeCount,setLikeCount] = useState(0)
  const [replyCount,setReplyCount] = useState(0)
  const [showReplyComment,setShowReplyComment] = useState(false)
  const [showReplyCommentBox , setShowReplyCommentBox] = useState(false)
  const [replyComment,setReplyComment] = useState("")
  const [replyComments,setReplyComments] = useState<Array<replyCommentType>>([]);
  const [likeSendUsers,setLikeSendUsers] = useState<Array<LikeType>>([]);
  const [showLikeModal,setShowLikeModal] = useState(false)
  const [likeId,setLikeId] = useState("")
  const currentUser = useSelector((state: RootState) => state.user.currentUser)


  const handleReplyCommentForm = useCallback(() => {
    setShowReplyComment(!showReplyComment)
  },[showReplyComment])

  const handleReplyCommentBox = useCallback(() =>{
    setShowReplyCommentBox(!showReplyCommentBox)
  },[showReplyCommentBox])

  const hanleReplyComment = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setReplyComment(e.target.value)
  },[])

  const handleShowLikeModal = useCallback(()=>{
    setShowLikeModal(true)
  },[])
  const handleCloseLikeModal = useCallback(()=>{
    setShowLikeModal(false)
  },[])

  useEffect(() => {
    addLikeListeners()
    addReplyListeners()
}, [])

  const addLikeListeners = async () => {
    await firestoreService
      .collection("comment")
      .doc(comment.id)
      .collection("like")
      .onSnapshot((snapshot) => {
        const likeArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        snapshot.docs.map((doc) => {
          if (doc.data().id === currentUser.uid) {
            setLikeId(doc.id);
          }
        });
        setLikeSendUsers(likeArray);
        setLikeCount(likeArray.length);
        likeArray.map((post) => {
          if (post.id === currentUser.uid) {
            setHasLike(true);
          }
        });
      });
  };

  const addReplyListeners = async() => {
    await firestoreService.collection("comment").doc(comment.id).collection("reply").onSnapshot((snapshot) => {
      const replyArray = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReplyCount(replyArray.length)
      setReplyComments(replyArray)
  })}
  

  const handleLike = async () => {
    if (hasLike === false) {
      try {
        await firestoreService.collection("comment").doc(comment.id).collection("like").add(createLike())
        comment.writer.id !== currentUser.uid && await firestoreService.collection("notification").doc(comment.writer.id).collection("notification").add(createLikeCommentNotification())
        setHasLike(true)
        setLikeCount(likeCount + 1)
      } catch (err) {
        console.log(err)
      }
    }
    else {
      try {
        await firestoreService.collection("comment").doc(comment.id).collection("like").doc(likeId).delete()
        setHasLike(!hasLike)
      } catch (err) {
        console.log(err)
      }
    }
  }
  const createLike = () => {
    const like = {
      id:currentUser.uid,
      name:currentUser.displayName,
      image:currentUser.photoURL
    }
    return like
  }

  const createLikeCommentNotification = () => {
    const notification = {
        fromUserName:currentUser.displayName,
        fromUserId:currentUser.uid,
        fromUserImg:currentUser.photoURL,
        postFileUrl:post.fileUrl,
        postId:post.id,
        postFileType:post.fileType,
        notification:"commentLike"
    }
    return notification
}


  const onSubmitReplyComment = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
      await firestoreService.collection("comment").doc(comment.id).collection("reply").add(createMessage())
      comment.writer.id!== currentUser.uid && await firestoreService.collection("notification").doc(comment.writer.id).collection("notification").add(createReplyCommentNotification())
      setReplyComment("")
    } catch (err) {
      console.log(err)
      setReplyComment("")
    }
  }

const createMessage = ()=> {
  const today = new Date()
  const yearMonthDay = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}` //For the elapsed time of message transmission
  const hourminutesecond = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`//For the elapsed time of message transmission
  const message = {
      timestamp: today,
      content:replyComment,
      yearMonthDay:yearMonthDay,
      hourminutesecond:hourminutesecond,
      writer:{
          id: currentUser.uid,
          name: currentUser.displayName,
          image: currentUser.photoURL
      }
  }
  return message
}


const createReplyCommentNotification = () => {
  const notification = {
      fromUserName:currentUser.displayName,
      fromUserId:currentUser.uid,
      fromUserImg:currentUser.photoURL,
      postFileUrl:post.fileUrl,
      postId:post.id,
      postFileType:post.fileType,
      notification:"replyComment"
  }
  return notification
}


  return <>
    <div style={{ height: "60px", display: "flex", margin: "10px 0 0 0", position: "relative" }}>
      {
        post?.user.id===currentUser.uid ?<Link to="/myprofile"><img src={comment.writer.image} height={32} width={32} style={{ margin: "15px 0 0 17px", borderRadius: "70%" }} /></Link>
        : <Link to={"/profile/" + post?.user.id}><img src={comment.writer.image} height={32} width={32} style={{ margin: "15px 0 0 17px", borderRadius: "70%" }} /></Link>
      }
      <div style={{ margin: "10px 0 0 13px"}}>
        <div style={{fontSize:"13px"}}>
          {
            post?.user.id===currentUser.uid ?<Link to="/myprofile"><span style={{ fontWeight: "bold",color:"black" }}>{comment.writer.name}&nbsp;</span></Link>
            :<Link to={"/profile/" + post?.user.id}><span style={{ fontWeight: "bold",color:"black" }}>{comment.writer.name}&nbsp;</span></Link>
          }
          {comment.content}</div>
        {likeCount>0 &&<span style={{ color: "gray", fontSize: "12px", paddingLeft: "12px",cursor:"pointer" }} onClick={handleShowLikeModal}>great {likeCount}Like</span>}
        <span style={{ color: "gray", fontSize: "12px", paddingLeft: "12px", cursor: "pointer" }} onClick={handleReplyCommentForm}>reply</span>
        {replyCount>0 &&<span style={{ color: "gray", fontSize: "12px", paddingLeft: "12px", cursor: "pointer" }} onClick={handleReplyCommentBox}>View replies({replyCount})</span>}
      </div>
      {
        hasLike === false ? <AiOutlineHeart className="heart" size={13} style={{ position: "absolute", top: "16px", left: "470px" }} onClick={handleLike} />
          : <AiFillHeart className="heart" size={13} style={{ position: "absolute", top: "16px", left: "470px" }} onClick={handleLike} />
      }
    </div>
    {
      showReplyComment === true ? <div style={{ margin: "12px 0 0 65px", display: "flex" }}>
        <AiOutlineSmile size={22} style={{ marginRight: "13px" }} />
        <form onSubmit={onSubmitReplyComment}>
          <input type="text" placeholder="Reply to..." style={{width:"350px"}} onChange={hanleReplyComment} value={replyComment} />
          <button style={{ color: "rgb(30, 140, 230)",  backgroundColor: "white", fontWeight: "bold", border: "1px solid white" }}>posting</button>
        </form>
      </div> : null
    }
    {
      showReplyCommentBox === true ? replyComments.map((comment) =>
        <div style={{ height: "60px", display: "flex", margin: "10px 0 0 45px", position: "relative" }}>
          <img src={comment.writer?.image} height={32} width={32} style={{ margin: "15px 0 0 17px", borderRadius: "70%" }} />
          <div style={{ margin: "10px 0 0 13px" }}>
            <div style={{fontSize:"12px"}}><span style={{ fontWeight: "bold" }}>{comment.writer?.name}&nbsp;</span>{comment.content}</div>
            <span style={{ color: "gray", fontSize: "11px" }}>{moment(`${comment.yearMonthDay} ${comment.hourminutesecond}`).fromNow()}</span>
          </div>
        </div>)
        : null
    }
    <Modal show={showLikeModal} onHide={handleCloseLikeModal} style={{ margin: "250px 0 0 700px",width:"450px" }}>
      <Modal.Header closeButton>
        <div style={{ padding: "0 0 20px 180px", fontSize: "17px", fontWeight: "bold", height: "0px" }}>great</div>
      </Modal.Header>
      <div>
        {
          likeSendUsers.map(user => {
            if (user.id !== currentUser.uid) {
              return <Link to={"/profile/" + user.id}><div style={{ display: "flex", margin: "15px 0 15px 15px" }}>
                <img src={user.image} height={40} width={40} style={{ borderRadius: "100%" }} />
                <div style={{ margin: "5px 0 0 10px", fontWeight: "bold", color: "black" }}>{user.name}</div>
              </div></Link>
            }
            else {
              return <Link to="/myprofile"><div style={{ display: "flex", margin: "15px 0 15px 15px" }}>
                <img src={user.image} height={40} width={40} style={{ borderRadius: "100%" }} />
                <div style={{ margin: "5px 0 0 10px", fontWeight: "bold", color: "black" }}>{user.name}</div>
              </div></Link>
            }
          })
        }
      </div>
    </Modal>
  </>
}

export default PostComments;
