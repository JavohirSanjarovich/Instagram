import React,{useEffect,useState,useRef, useCallback} from 'react';
import {BsInfoCircle} from  'react-icons/bs'
import {firestoreService,databaseService,storageService} from '../../../fbase'
import {useSelector,useDispatch} from 'react-redux'
import {RootState} from '../../../redux/_reducers'
import {FaRegPaperPlane} from 'react-icons/fa'
import {Button} from 'antd'
import {AiOutlineSmile} from 'react-icons/ai'
import {RiImageLine}from 'react-icons/ri'
import { Modal } from 'react-bootstrap'
import {setCurrentChatRoom,setReadMessages} from'../../../redux/_actions/user_actions'

interface Message {
    fileType:string 
    id:string 
    image:string
    content?:string 
    name:string 
}

function ChatPanel() {
    const [messages,setMessages] = useState<Array<Message>>([]); 
    const currentUser = useSelector((state: RootState) => state.user.currentUser)
    const currentChatRoom =  useSelector((state: RootState) => state.user.currentChatRoom)
    const [showChatRoom,setShowChatRoom] = useState(false)
    const [content,setContent] = useState("")
    const [chatDeleteModal,setChatDeleteModal] = useState(false)
    const [readMessageCount,setReadMessageCount] = useState(0)
    const dispatch = useDispatch()
    const fileUploadRef = useRef<HTMLInputElement>(null);
    const readMessagesCount = useSelector((state:RootState) => state.user.messagesCount.readMessagesCount)


    const showChatModal= useCallback(()=>{
        setChatDeleteModal(true)
    },[])
    const closeChatModal = useCallback(()=>{
        setChatDeleteModal(false)
    },[])

    const handleShowChatRoom = useCallback(()=>{
        setShowChatRoom(true)
        dispatch(setReadMessages(readMessageCount))
    },[readMessageCount])

    useEffect(() => {
        if (currentChatRoom !== undefined && currentChatRoom !== null) {
            addMessagesListeners()
            addMessageNotificationListeners()
            console.log(currentChatRoom.chatRoomId)
        }
        return () => {
            databaseService.ref("messages").off()
          };
    }, [])

    const addMessageNotificationListeners = async () => {
        let number = 0
        try{
          await databaseService.ref("messages").child(currentChatRoom.chatRoomId).on("child_added", DataSnapshot => {
                if(DataSnapshot.val().id!==currentUser.uid){
                    number+=1
                }
          })
          setReadMessageCount(number+readMessagesCount)
      } catch (err) {
          console.log(err)
        }
      }


    const addMessagesListeners = async() => {
        try{
            let messagesArray: Message[] = []
            await databaseService.ref("messages").child(currentChatRoom.chatRoomId).on("child_added", DataSnapshot => {
                messagesArray.push(DataSnapshot.val())
                setMessages(messagesArray)
            })
        }
        catch(err){
            console.log(err)
        }
    }


    const handleMessageSubmit = async()=>{
        try {
            await databaseService.ref("messages").child(currentChatRoom.chatRoomId).push().set(createMessage("")) 
            setContent("")
        }
        catch (err) {
            setContent("")
            console.log(err)
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.keyCode === 13) {
            handleMessageSubmit();
        }
    }

    const createMessage = (fileUrl:string) =>{
        const message = {
                id:currentUser.uid,
                name:currentUser.displayName,
                content:content,
                image:fileUrl
        }
        return message
    }


    const handleOpenFileUpload = useCallback(() => {
        fileUploadRef.current && fileUploadRef.current.click()
    },[])
    
    const handleUploadFile = async (event: { target: HTMLInputElement }) => {
        if (event.target.files)
        {
            const file = event.target.files[0]
            const metadata = {contentType: file.type}
        try{ 
             let uploadTaskSnapshot = await storageService.ref().child(`message/${currentChatRoom.id}/${file.name}`).put(file, metadata)  //user_image폴더안에 user.uid이름으로 저장
             let downloadURL = await uploadTaskSnapshot.ref.getDownloadURL()

             await databaseService.ref("messages").child(currentChatRoom.id).push().set(createMessage(downloadURL))

        }catch(err){
            console.log(err)
        }

        }
    }

    const handleDeleteChat = async() => {
        try {
            await firestoreService.collection("message").doc(currentChatRoom.chatRoomId).delete()
            await databaseService.ref("messages").child(currentChatRoom.chatRoomId).remove()
            dispatch(setCurrentChatRoom(null))
            closeChatModal()
            setShowChatRoom(false)
        }catch (err) {
            console.log(err)
        }
    }


    //채팅방에 메시지 뿌려주기
    const renderMessages = (messages: Message[]) =>
        messages.map(msg => {
            if (msg.id === currentUser.uid) {
                if (msg.image) {
                    if (msg.fileType === "video/mp4") {
                        return <div style={{
                            width: `35%`, borderRadius: "15px"
                            , textAlign: "center", margin: "10px 0 0 350px"
                        }} key={msg.id}>
                            <video src={msg.image} width={230} height={140} style={{ borderRadius: "20px" }} controls />
                        </div>
                    }
                    else {
                        return <div style={{
                            width: `35%`, borderRadius: "15px"
                            , textAlign: "center", margin: "10px 0 0 350px"
                        }} key={msg.id}>
                            <img src={msg.image} width={230} height={140} style={{ borderRadius: "20px" }} />
                        </div>
                    }
                }
                else {
                    return <div style={{
                        backgroundColor: "rgb(235, 235, 235)", width: `35%`, borderRadius: "15px"
                        , textAlign: "center", margin: "10px 0 0 370px"
                    }} key={msg.id}>
                        {msg.content}
                    </div>
                }
            }
            else {
                if (msg.image) {
                    if (msg.fileType === "video/mp4") {
                        return <div style={{
                            width: `35%`, borderRadius: "15px"
                            , textAlign: "center", margin: "10px 0 0 10px"
                        }} key={msg.id}>
                            <video src={msg.image} width={230} height={140} style={{ borderRadius: "20px" }} />
                        </div>
                    }
                    else {
                        return <div style={{
                            width: `35%`, borderRadius: "15px"
                            , textAlign: "center", margin: "10px 0 0 10px"
                        }} key={msg.id}>
                            <img src={msg.image} width={230} height={140} style={{ borderRadius: "20px" }} />
                        </div>
                    }
                }
                else {
                    return <div style={{
                        backgroundColor: "rgb(235, 235, 235)", width: `35%`, borderRadius: "15px"
                        , textAlign: "center", margin: "10px 0 0 10px" }}  key={msg.id}>
                        {msg.content}
                    </div>
                }
                return 
            }
        })

    return <section style={{ width: "63%" }}>
        {
            showChatRoom ?
                <>
                    <header style={{ height: "60px", borderBottom: "1px solid rgb(220, 220, 220)", fontSize: "17px", padding: "15px 0 0 10px", fontWeight: "bold", display: "flex",position:"relative" }}>
                        {
                            currentChatRoom?.fromUserId === currentUser.uid ? <div style={{ display: "flex" }}><img src={currentChatRoom?.toUserImg} width={25} height={25}
                                style={{ borderRadius: "100%", marginTop: "5px" }} />
                                <div style={{ margin: "5px 0 0 0", fontSize: "15px" }} >{currentChatRoom?.toUserName}님</div></div> : <div style={{ display: "flex" }}>
                                <img src={currentChatRoom?.fromUserImg} width={25} height={25} style={{ borderRadius: "100%", marginTop: "5px" }} />
                                <div style={{ margin: "5px 0 0 10px", fontSize: "15px" }} >{currentChatRoom?.fromUserName}님</div></div>
                        }
                        <BsInfoCircle style={{ cursor: 'pointer', position:"absolute",right:"20px" }} size={23} onClick={showChatModal} />
                    </header>
                    <div>
                        <article className="chatContainer" style={{ height: "705px", overflowY: "scroll" }}>
                            {
                                 messages.length > 0 && renderMessages(messages)
                            }
                        </article>
                        <div style={{ height: "50px" }}></div>
                        <footer style={{ border: "1px solid rgb(220, 220, 220)", borderRadius: "20px", margin: "0 20px 0 20px", display: "flex" }}>
                            <AiOutlineSmile size={35} style={{ margin: "3px 0 0 15px" }} />
                            <input type="text" placeholder="메시지 입력...." style={{ width: "100%", height: "40px", paddingLeft: "15px" }}
                             value={content} onChange={(e) => setContent(e.target.value)} onKeyDown={handleKeyDown}/>
                            {
                                content ? <button style={{
                                    color: "rgb(30, 140, 230)", backgroundColor: "white", fontWeight: "bold", border: "1px solid white"
                                    , width: "100px", marginRight: "11px"
                                }} onClick={handleMessageSubmit} >보내기</button> :
                                <RiImageLine size={30} style={{ margin: "7px 25px 0 0",cursor:"pointer" }} onClick={handleOpenFileUpload}/>
                            }
                            <input type="file" ref={fileUploadRef} onChange={handleUploadFile} style={{ display: "none" }} />
                        </footer>;
                    </div>
                </> : <article>
            <div style={{ border: "2px solid black", width: "100px", height: "100px", borderRadius: "100%", margin: "330px 0 0 250px" }}>
                <FaRegPaperPlane size={50} style={{ margin: "20px 0 0 20px" }} />
            </div>
            <div style={{ margin: "10px 0 0 250px", fontSize: "22px", fontWeight: "100" }}>my message</div>
            <div style={{ margin: "10px 0 0 140px", color: "gray" }}>Send private photos and messages to friends or groups.</div>
            {
                currentChatRoom !==undefined &&
                <Button type="primary" style={{ fontWeight: "bold", width: "100px", height: "30px", padding: "0 0 0 2px", borderRadius: "4px", margin: "20px 0 0 250px" }}
                onClick={handleShowChatRoom}>Chat room entry</Button>
            }

        </article>
        }
                    <Modal show={chatDeleteModal} onHide={closeChatModal} style={{ marginTop: '230px', marginLeft: '760px', width: '410px' }}>
                <div style={{ borderRadius: "35px" }}>
                    <div className='modal1' style={{
                        height: "160px", borderBottom: "1px solid rgb(220, 220, 220)",
                        textAlign: "center", paddingTop: "15px", cursor: "pointer"
                    }} >
                        <div style={{marginTop:"25px",fontWeight:"bold",fontSize:"20px"}}>Are you sure you want to delete the chat?</div>
                        <div style={{marginTop:"7px",color:"gray",padding:"15px"}}>Deleting will remove the chat from your inbox. It will still appear in other people's inboxes.</div>
                    </div>
                    <div className='modal2' style={{
                        height: "47px", borderBottom: "1px solid rgb(220, 220, 220)",
                        textAlign: "center", paddingTop: "12px", cursor: "pointer",color:"red", fontWeight: "bold"
                    }} onClick={handleDeleteChat}>
                        delete
                    </div>
                    <div className='modal3' style={{
                        height: "45px", textAlign: "center", paddingTop: "12px",
                        cursor: "pointer",borderBottom: "1px solid rgb(220, 220, 220)"
                    }} onClick={closeChatModal}>
                        cancel
                    </div>
                </div>
            </Modal>
    </section>
}

export default ChatPanel;
