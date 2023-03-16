import React, { useEffect, useState } from 'react';
import { Skeleton } from 'antd';
import {useSelector,useDispatch} from 'react-redux'
import {RootState} from '../../../redux/_reducers'
import {firestoreService} from '../../../fbase'
import {setCurrentChatRoom} from'../../../redux/_actions/user_actions'

interface chatRoom {
    id: string
    chatRoomId?: string
    fromUserId?: string
    fromUserImg?: string
    fromUserName?: string
    toUserId?: string
    toUserImg?: string
    toUserName?: string
}

function SidePanel() {
    const [chatRooms, setChatRooms] = useState<Array<chatRoom>>([]);
    const [chatRooms2, setChatRooms2] = useState<Array<chatRoom>>([]);
    const [currentChatRoomId, setCurrentChatRommId] = useState("")
    const currentUser = useSelector((state: RootState) => state.user.currentUser)
    const dispatch = useDispatch()

    useEffect(() => {
        addChatRoomListeners()
        addChatRoomListeners2()
    }, [])

    const addChatRoomListeners = async() => {
        const currentChatroom:chatRoom[] = []
        try {
            await firestoreService.collection(`message`).where("fromUserId", "==",currentUser.uid).onSnapshot((snapshot) => {
                const chatRoomArray = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                console.log(chatRoomArray.length)
                setChatRooms(chatRoomArray)
                currentChatroom.push(chatRoomArray[0])
                setCurrentChatRommId(chatRoomArray[0].id)
            })
        } catch (err) {
            console.log(err)
        }
    }

    const addChatRoomListeners2 = async() => {
        try {
            await firestoreService.collection(`message`).where("toUserId","==",currentUser.uid).onSnapshot((snapshot) => {
                const messageArray = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));           
                setChatRooms2(messageArray)
            })
        } catch (err) {
            console.log(err)
        }
    }

    
    const changeCurrentChatRoom = (room: chatRoom) => (event: React.MouseEvent) => {
        setCurrentChatRommId(room.id)
        dispatch(setCurrentChatRoom(room))
    }

    const renderChatRoomCard = (chatRooms: chatRoom[]) =>
        chatRooms.map(room => {
            {
                if (currentChatRoomId === room.id) {
                    return <div style={{ width: "100%", height: "70px", cursor: "pointer", backgroundColor: "rgb(240, 240, 240)", display: "flex" }}
                     onClick={changeCurrentChatRoom(room)} key={room.id}>
                        <img src={room.toUserImg} width={50} height={50} style={{ borderRadius: "100%", margin: "10px 0 0 20px" }} />
                        <div style={{ margin: "25px 0 0 20px" }}>{room.toUserName}sir</div>
                    </div>
                }
                else {
                    return <div style={{ width: "100%", height: "70px", cursor: "pointer", display: "flex" }} onClick={changeCurrentChatRoom(room)} key={room.id}>
                        <img src={room.toUserImg} width={50} height={50} style={{ borderRadius: "100%", margin: "10px 0 0 20px" }} />
                        <div style={{ margin: "25px 0 0 20px" }}>{room.toUserName}sir</div>
                    </div>
                }
            }
        }
        )

        const renderChatRoomCard2 = (chatRooms: chatRoom[]) =>
        chatRooms.map(room => {
            {
                if (currentChatRoomId === room.id) {
                    return <div style={{ width: "100%", height: "70px", cursor: "pointer", backgroundColor: "rgb(240, 240, 240)", display: "flex" }}
                     onClick={changeCurrentChatRoom(room)} key={room.id}>
                        <img src={room.fromUserImg} width={50} height={50} style={{ borderRadius: "100%", margin: "10px 0 0 20px" }} />
                        <div style={{ margin: "25px 0 0 20px" }}>{room.fromUserName}님</div>
                    </div>
                }
                else {
                    return <div style={{ width: "100%", height: "70px", cursor: "pointer", display: "flex" }} onClick={changeCurrentChatRoom(room)} key={room.id}>
                        <img src={room.fromUserImg} width={50} height={50} style={{ borderRadius: "100%", margin: "10px 0 0 20px" }} />
                        <div style={{ margin: "25px 0 0 20px" }}>{room.fromUserName}님</div>
                    </div>
                }
            }
        }
        )


    return <aside style={{ width: "37%", borderRight: "1px solid rgb(220, 220, 220)" }}>
        <header style={{ height: "60px", borderBottom: "1px solid rgb(220, 220, 220)", fontSize: "17px", textAlign: "center", paddingTop: "15px", fontWeight: "bold" }}>
            {currentUser.displayName}</header>
        <div style={{ margin: "10px 0 0 0" }}>
            {
                chatRooms.length > 0 || chatRooms2.length>0 ? <div>{renderChatRoomCard(chatRooms)}</div> : [...new Array(3)].map(() => (
                    <Skeleton avatar paragraph={{ rows: 1, width: 100 }} style={{ marginLeft: "10px" }} />
                ))
            }
            <div>{renderChatRoomCard2(chatRooms2)}</div>
        </div>
    </aside>;
}

export default SidePanel;
