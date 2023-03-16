import React,{useEffect} from 'react';
import NavBar from '../common/Navbar'
import {useSelector,useDispatch} from 'react-redux'
import {RootState} from '../../redux/_reducers'
import SidePanel from './DirectMessageComponent/SidePanel';
import ChatPanel from './DirectMessageComponent/ChatPanel';
import {setCurrentChatRoom} from '../../redux/_actions/user_actions'
import {firestoreService} from '../../fbase';
import {ToastContainer} from "react-toastify";
function DirectMessage() {
    const currentUser = useSelector((state: RootState) => state.user.currentUser)
    const currentChatRoom =  useSelector((state: RootState) => state.user.currentChatRoom)
    const dispatch = useDispatch()

    useEffect(() => {
        addChatRoomListeners()
      }, [])
      const addChatRoomListeners = async() => {
        try {
            await firestoreService.collection(`message`).where("fromUserId","==",currentUser.uid).onSnapshot((snapshot) => {
                const messageArray = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                if(messageArray.length===0){
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



    return <>
        <NavBar />
        <ToastContainer/>
        <main className="chatRoomContainer" style={{backgroundColor: "white", width: "940px", height: "900px",justifyContent:"center",
        border: "1px solid rgb(220, 220, 220)", display: "flex", margin: "15px 0 0 25%"}}>
            <SidePanel key={currentUser.uid} />
            <ChatPanel key={currentChatRoom && currentChatRoom.id} />
        </main>
    </>;
}

export default DirectMessage;
