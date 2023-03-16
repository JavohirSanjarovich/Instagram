import { SET_USER, CLEAR_USER, CHANGE_NAME,SET_PHOTO_URL,SET_CURRENT_CHAT_ROOM,USER_EDIT_PROFILE,SET_NOTIFICATION,SET_UNREAD_MESSAGES ,SET_READ_MESSAGES
    ,SET_UNREAD_NOTIFICATION,SET_READ_NOTIFICATION} from '../_actions/types'


type CounterState  = {
    currentUser: {},
    notification:Array<any>,
    currentUserProfile:null,
    currentChatRoom: null,
    messagesCount:{
        unreadMessagesCount:number
        readMessagesCount:number
    },
    notificationsCount:{
        unReadNotificationsCount:number
        readNotificationsCount:number  
    }
  };
  
  
  const initialState: CounterState = {
    currentUser: {},
    notification:[],
    currentUserProfile:null,
    currentChatRoom: null,
    messagesCount:{
        unreadMessagesCount:0,
        readMessagesCount:0
    },
    notificationsCount:{
        unReadNotificationsCount:0,
        readNotificationsCount:0
    }
  };



export default function (state:CounterState = initialState, action :any) {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                currentUser: action.payload, 
            }
        case CLEAR_USER:
            return{
                ...state,
                currentUser: null  
            }
        case CHANGE_NAME:
            return{
                ...state,
                 currentUser: {...state.currentUser ,displayName : action.payload }
            }
        case SET_PHOTO_URL:
            return {
                ...state,
                currentUser: {...state.currentUser , photoURL: action.payload } 
            }
        case SET_CURRENT_CHAT_ROOM:
            return {
                ...state,
                currentChatRoom: action.payload
            }
        case USER_EDIT_PROFILE:
            return {
                ...state,
                currentUserProfile: action.payload, 
            }
        case SET_NOTIFICATION:
            return {
                ...state,
                notification: action.payload
            }
        case SET_UNREAD_MESSAGES:
            return {
                ...state,
                messagesCount: { ...state.messagesCount, unreadMessagesCount: action.payload }
            }
        case SET_READ_MESSAGES:
            return {
                ...state,
                messagesCount: { ...state.messagesCount, readMessagesCount: action.payload }
            }
        case SET_UNREAD_NOTIFICATION:
            return {
                ...state,
                notificationsCount:{...state.notificationsCount,unReadNotificationsCount:action.payload}
            }
        case SET_READ_NOTIFICATION:
            return {
                ...state,
                notificationsCount:{...state.notificationsCount,readNotificationsCount:action.payload}
            }
        default:
            return state
    }
}