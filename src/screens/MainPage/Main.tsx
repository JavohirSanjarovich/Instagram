import React,{useState,useEffect} from 'react'
import Navbar from '../common/Navbar'
import {useSelector,useDispatch} from 'react-redux'
import {RootState} from '../../redux/_reducers'
import {firestoreService,databaseService} from '../../fbase';
import PostCard from './MainComponent/PostCard'
import {Link} from 'react-router-dom'
import  FollowCard from "./MainComponent/FollowCard";
import NonFollowCard from './MainComponent/NonFollowCard';
import {setCurrentChatRoom,userEditProfile,setNotification,setUnreadMessages,setUnReadNotification,setReadMessages, setReadNotification} from'../../redux/_actions/user_actions'

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

interface LikeType {
  id: string
  likeSender?:{id:string,name:string}
  postId?: string
}

function Main() {
  const [posts, setPosts] = useState<Array<any>>([]);
  const [allLike,setAllLike] = useState<Array<LikeType>>([]);
  const [allSavePost,setAllSavePost] = useState<Array<SaveType>>([]);
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const dispatch = useDispatch()


  useEffect(() => {
    // dispatch(setReadMessages(0))
    // dispatch(setReadNotification(0))
    addMessageNotificationListeners()
    addPostListeners()
    addLikeListeners()
    addSaveListeners()
    addChatRoomListeners()
    addUserProfileListeners()
    addNotificationListeners()
    return () => {
      databaseService.ref("messages").off()
    };
  }, [])




  const addPostListeners = async() => {
    try {
      await firestoreService.collection("posts").onSnapshot((snapshot) => {
        setPosts(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        )
      })
    } catch (err) {
      console.log(err)
    }
  }

  const addLikeListeners = async () => {
    try {
      await firestoreService.collection("likes").onSnapshot((snapshot) => {
        setAllLike(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        )
      });
    } catch (err) {
      console.log(err)
    }
  }


  const addSaveListeners = async () => {
    try {
      await firestoreService.collection("saves").doc(currentUser.uid).collection("saves").onSnapshot((snapshot) => {
        setAllSavePost(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        )
      });
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


  const addNotificationListeners = async () => {
    try {
      await firestoreService.collection(`notification`).doc(currentUser.uid).collection("notification").onSnapshot((snapshot) => {
        const followArray = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        dispatch(setNotification(followArray))
        dispatch(setUnReadNotification(followArray.length))
      })
    } catch (err) {
      console.log(err)
    }
  }

  const addMessageNotificationListeners = async () => {
    let number = 0
    try{
      await databaseService.ref("messages").on("child_added", DataSnapshot => {
        if (DataSnapshot.key?.includes(currentUser.uid)) {
          for (const key in DataSnapshot.val()) {
            if (DataSnapshot.val()[key].id !== currentUser.uid) {
                number+=1
            }
          }
        }
        dispatch(setUnreadMessages(number))
      })
     
  } catch (err) {
      console.log(err)
    }
  }


  const renderPostCard = (posts: PostType[]) =>
    posts.map(post => {
      switch (post.fileType) {
        case "image/jpeg": {
          return <PostCard post={post} key={post.id}  allLike={allLike} allSavePost={allSavePost} />
        }
        case "video/mp4": {
          return <PostCard post={post} key={post.id}  allLike={allLike} allSavePost={allSavePost} />
        }
      }
    }
)
  return (
    <>
      <Navbar />
      <main className="mainContainer" style={{ width: "100%",display:"flex",justifyContent:"center",alignItems:"center" }}> 
        <div style={{ display: "flex" }}>
          <section>
              <FollowCard/>
              {posts && renderPostCard(posts)}
          </section>
          <aside className="mainRightSideBar" style={{ width: "325px", height: "450px", margin: "35px 0 0 0", borderRadius: "5px"}}>
            <div style={{display:"flex" , margin: "25px 0 0 30px"}}>
              <Link to="/myprofile"><img src={currentUser && currentUser.photoURL} width={55} height={55} style={{borderRadius:"100%"}} /></Link>
              <Link to="/myprofile"><div style={{ margin: "13px 0 0 15px",fontSize:"15px",color:"black" }}>{currentUser && currentUser.displayName}</div></Link>
            </div>
            <div style={{ display: "flex", margin: "25px 0 0 30px" }}>
              <span style={{ color: "gray", fontWeight: "bold" }}>Recommendations for members</span>
              <span style={{ fontSize: "12px", fontWeight: "bold", marginLeft: "120px" }}>view all</span>
            </div>
            <NonFollowCard />
            <div style={{ margin: "25px 0 0 25px", fontSize: "11px", fontWeight: "lighter", color: "rgb(180, 180, 180)" }}>
            introduction . Help . Public Relations Center. API. Recruitment information.
            </div>
            <div style={{ margin: "0 0 0 25px", fontSize: "11px", fontWeight: "lighter", color: "rgb(180, 180, 180)" }}>
            privacy policy . terms . location . popular account. hashtag.language
            </div>
            <div style={{ margin: "15px 0 0 25px", fontSize: "11px", fontWeight: "lighter", color: "rgb(180, 180, 180)" }}>
              INSTAGRAM FROM META
            </div>
          </aside>
        </div>
      </main>
    </>
  )
}
export default Main;             

