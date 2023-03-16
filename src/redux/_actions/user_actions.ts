import { SET_USER, CLEAR_USER, CHANGE_NAME,SET_PHOTO_URL,SET_CURRENT_CHAT_ROOM,USER_EDIT_PROFILE,SET_NOTIFICATION,
    SET_UNREAD_MESSAGES,SET_READ_MESSAGES,SET_UNREAD_NOTIFICATION,SET_READ_NOTIFICATION} from './types';


export function setUser(user:any){
    return{
        type:SET_USER,
        payload:user// payload:JSON.parse(JSON.stringify(user))
    }
}
export function clearUser(){
    return{
        type:CLEAR_USER
    }
}
export function changeName(name:string){
    return{
        type:CHANGE_NAME,
        payload:name
    }
}
export function setPhotoURL(url:any){
    return{
        type:SET_PHOTO_URL,
        payload:url
    }
}
export function setCurrentChatRoom(currentChatRoom:any){
    return{
        type:SET_CURRENT_CHAT_ROOM,
        payload:currentChatRoom
    }
}
export function userEditProfile(userProfile:any){
    return{
        type:USER_EDIT_PROFILE,
        payload:userProfile
    }
}
export function setNotification(notification:any){
    return{
        type:SET_NOTIFICATION,
        payload:notification
    }
}
export function setUnreadMessages(message:any){
    return{
        type:SET_UNREAD_MESSAGES,
        payload:message
    }
}
export function setReadMessages(message:any){
    return{
        type:SET_READ_MESSAGES,
        payload:message
    }
}
export function setUnReadNotification(notification:any){
    return{
        type:SET_UNREAD_NOTIFICATION,
        payload:notification
    }
}
export function setReadNotification(notification:any){
    return{
        type:SET_READ_NOTIFICATION,
        payload:notification
    }
}
