import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import {firestoreService,databaseService} from '../../../fbase';
import {useSelector} from 'react-redux'
import {RootState} from '../../../redux/_reducers'
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface NonFollowUserType{
  id: string
  image: string
  name: string
}



function NonFollowCard() {
    const currentUser = useSelector((state: RootState) => state.user.currentUser)
    const [nonFollowUsers,setNonFollowUsers] = useState<Array<NonFollowUserType>>([]);

    useEffect(() => {
        addNonFollowListeners()
        return () => {
          databaseService.ref("users").off()
        };
    }, [])

  const addNonFollowListeners = async() => {
    try {
      const nonFollowArray: NonFollowUserType[] = [];
      await databaseService.ref("users").on("child_added", DataSnapshot => {
        if (DataSnapshot.val().id !== currentUser.uid && !DataSnapshot.val().hasOwnProperty(`${currentUser.uid}`)) {//whether the object contains a property
          nonFollowArray.push(DataSnapshot.val())
          setNonFollowUsers(nonFollowArray)
        }
      })
    
    }
    catch (err) {
      console.log(err)
    }
  }
  
  const handleFollow =  (id: string, name: string, image: string) => (event: React.MouseEvent) => {
    try {
          firestoreService.collection("follow").add(createFollowForm(id, name, image))
          databaseService.ref("users").child(id).child(currentUser.uid).push().set({ follow: true })
          firestoreService.collection("notification").doc(id).collection("notification").add(createFollowNotification())
          const filterNonFollow =  nonFollowUsers.filter((user)=>user.id!==id)
          setNonFollowUsers(filterNonFollow)
          toast.info("Successfully followed the user")
        } catch (err) {
          console.log(err)
          toast.error("Failed to follow the user")
      }
    }

    const createFollowForm = (id:string,name:string,image:string) => {
        const follow = {
            fromUserName:currentUser.displayName,
            fromUserId:currentUser.uid,
            fromUserImg:currentUser.photoURL,
            toUserName:name,
            toUserId:id,
            follow:true,
            img:image
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
    

  return <div style={{ height: "240px", margin: "15px 0 0 35px" }}>
    {nonFollowUsers.slice(0, 5).map((user) =>
      <div style={{ margin: "20px 0 0 0px", display: "flex" }} key={user.id}>
        <Link to={"/profile/" + user.id}><div><img src={user.image} width={32} height={32} style={{ borderRadius: "100%" }} /></div></Link>
        <Link to={"/profile/" + user.id}><div style={{ margin: "5px 0 0 10px", color: "black" }}>{user.name}</div></Link>
        <div style={{ color: "rgb(30, 140, 230)", margin: "13px 0 0 165px", fontWeight: "bold", border: "1px solid white", fontSize: "13px", cursor: "pointer" }}
          onClick={handleFollow(user.id, user.name, user.image)}>follow</div>
      </div>
    )
    }
  </div>;
}

export default NonFollowCard;
