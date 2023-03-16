import React,{useState,useEffect,useCallback} from 'react'
import {databaseService,firestoreService} from '../../fbase';
import {useSelector,useDispatch} from 'react-redux'
import {RootState} from '../../redux/_reducers'
// import { Button } from 'antd'
// import { Modal } from 'react-bootstrap'
import  Button  from 'antd/lib/button'
import  Modal  from 'react-bootstrap/Modal'
import {setCurrentChatRoom} from '../../redux/_actions/user_actions'
import {toast} from "react-toastify";



let userArray:object[] = []

interface GreetingsProps  {
    setSharedModal: (oepn:boolean) => void; // I mean a function that doesn't return anything.
    closeModal:()=>void
    post: any
}
function SearchShared({setSharedModal,closeModal,post}:GreetingsProps) {
    const [users,setUsers] = useState<Array<any>>([]);
    const currentUser = useSelector((state:RootState) => state.user.currentUser)
    const [sharedSerchTerm , setSharedSerchTerm] = useState("")
    const [sharedUsers,setSharedUsers] = useState<Array<any>>([]);
    const dispatch = useDispatch()
   
    useEffect(() => {
        addUserListeners()
        let userArray:object[] = []
        userArray = []
        return () => {
            databaseService.ref("users").off()
          };
      }, [])


      const addUserListeners = async() => {
        try {
          const userArray: string[] = [];
            await databaseService.ref("users").on("child_added", DataSnapshot => {
                userArray.push(DataSnapshot.val())
                setUsers(userArray)
                console.log(userArray)
            })
        }
        catch (err) {
            console.log(err)
        }
    }
    const AddSharedUsers = (user: any) => () => {
        userArray.push(user)
        setSharedUsers(userArray)
        const newUsers = users.filter(usr => usr !== user)
        setUsers(newUsers)
    }

    const handleSharedSerchTerm = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSharedSerchTerm(e.target.value)
    },[])
    
    const hadleShared = async () => {
        try {
            await sharedUsers.map((user) => {
                const chatRoomId = currentUser.uid > user.id ? `${currentUser.uid}${user.id}`
                    : `${user.id}${currentUser.uid}`
                firestoreService.collection('message').doc(chatRoomId).set(createChatRoom(chatRoomId, user.id, user.name, user.image))
                dispatch(setCurrentChatRoom(createChatRoom(chatRoomId, user.id, user.name, user.image)))
                databaseService.ref("messages").child(chatRoomId).push().set(createMessage(post.fileUrl, post.fileType))
            })
            toast.info("This post has been shared")
            userArray = []
            setSharedModal(false)
            closeModal()
        } catch (err) {
            toast.info("Failed to share this post")
        }
    }
    const createChatRoom = (ChatRoomid: string, userId: string, userName: string, userImg: string) => {
        const message = {
            fromUserId: currentUser.uid,
            fromUserName: currentUser.displayName,
            fromUserImg: currentUser.photoURL,
            toUserId: userId,
            toUserName: userName,
            toUserImg: userImg,
            chatRoomId: ChatRoomid
        }
        return message
    }

    const createMessage = (fileUrl: string, fileType: string) => {
        const message = {
            id: currentUser.uid,
            name: currentUser.displayName,
            image: fileUrl,
            fileType: fileType
        }
        return message
    }


    return <>
        <Modal.Header closeButton>
            <header style={{ padding: "0 0 20px 220px", fontSize: "17px", fontWeight: "bold", height: "0px" }}>share</header>
        </Modal.Header>
        <article>
            <div style={{ fontWeight: "bold", fontSize: "15px", padding: "15px 0 0 15px" }}>Recipient:</div>
            <div style={{
                borderBottom: "1px solid rgb(230,230,230)", margin: "15px 0 0 0",
                padding: "0 0 15px 15px"
            }}>
                {
                    sharedUsers.map((user) =>
                        <span key={user.id} style={{ backgroundColor: "rgb(194, 206, 247)", marginRight: "5px" }}>{user.name}</span>
                    )
                }
                <input type="text" placeholder="search..." onChange={handleSharedSerchTerm} style={{
                    width: "505px", marginTop: "5px"
                }} value={sharedSerchTerm} />
            </div>
            <div style={{ height: "400px", overflowY: "scroll" }}>
                {users.map((user) => {
                    if (user.name.includes(sharedSerchTerm) && user.id !== currentUser.uid) {
                        return <div style={{ display: "flex", cursor: "pointer" }} className="serchCard" key={user.id} onClick={AddSharedUsers(user)}>
                            <img src={user.image} width={45} height={45} style={{ borderRadius: "100%", margin: "5px 0 10px 15px" }} />
                            <div style={{ margin: "15px 0 0 10px", color: "gray" }}>{user.name}</div>
                        </div>
                    }
                }
                )}
            </div>
        </article>
        <Modal.Footer>
            <Button type="primary" style={{ width: "100%" }} onClick={hadleShared}>Send</Button>
        </Modal.Footer>
    </>;
}

export default SearchShared;



