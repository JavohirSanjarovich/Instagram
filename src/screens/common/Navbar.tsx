import React , {useState,useCallback, useEffect} from 'react'
// import { Nav, Navbar, Form, FormControl, NavDropdown } from 'react-bootstrap'
import  Nav  from 'react-bootstrap/Nav'
import  Navbar  from 'react-bootstrap/Navbar'
import  Form  from 'react-bootstrap/Form'
import  FormControl  from 'react-bootstrap/FormControl'
import  NavDropdown  from 'react-bootstrap/NavDropdown'
import { Link } from "react-router-dom";
import { authService } from '../../fbase'
import {FaRegPaperPlane} from 'react-icons/fa'
import {FaPaperPlane} from 'react-icons/fa'
import {FiPlusSquare}from 'react-icons/fi'
import {AiFillPlusSquare}from 'react-icons/ai'
import {GrPowerCycle} from 'react-icons/gr'
import {AiOutlineHeart} from 'react-icons/ai'
import {AiFillHeart} from 'react-icons/ai'
import {CgProfile} from 'react-icons/cg'
import {FiSettings} from 'react-icons/fi'
import FileUpload from './FileUpload';
import {useSelector,useDispatch} from 'react-redux'
import {RootState} from '../../redux/_reducers'
import SerchForm from './SerchForm';
import {toast} from "react-toastify";
import Notification from './Notification';
import {setReadNotification} from'../../redux/_actions/user_actions'
import 'bootstrap/js/dist/modal'; 
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/tooltip';
import 'bootstrap/dist/css/bootstrap.css';
import {AiFillHome}from 'react-icons/ai'
import {AiOutlineHome}from 'react-icons/ai'

function NavbarComponent() {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [fileURL,setFileURL] = useState("")
    const [ModalSize , setModalSize] = useState({width: "760px",marginLeft:"580px"})
    const [description,setDescription] = useState("")
    const [location,setLocation] = useState("")
    const [replacedText,setReplacedText] = useState("")
    const [commentOff,setCommentOff] = useState(false)
    const [fileType,setFileType] = useState("")
    const [searchTerm,setSearchTerm] = useState("")
    const [serchDropDown,setSerchDropDown] = useState("none")
    const [showNotificationBox,setShowNotificationBox] = useState(false)
    const currentUser = useSelector((state:RootState) => state.user.currentUser)
    const unReadMessagesCount = useSelector((state:RootState) => state.user.messagesCount.unreadMessagesCount)
    const readMessagesCount = useSelector((state:RootState) => state.user.messagesCount.readMessagesCount)
    const unReadNotificationsCount =useSelector((state:RootState) => state.user.notificationsCount.unReadNotificationsCount)
    const readNotificationsCount =useSelector((state:RootState) => state.user.notificationsCount.readNotificationsCount)
    const dispatch = useDispatch()


    const handleShowUploadModal = useCallback(() => {
        setShowUploadModal(true);
    },[])

    const handleCloseUploadModal = useCallback(() => {
        setFileURL("")
        setModalSize({ width: "760px", marginLeft: "580px" })
        setShowUploadModal(false);
        setDescription("")
        setLocation("")
        setReplacedText("")
        setCommentOff(false)
        setFileType("")
    },[])

    const handleSerchTerm = useCallback((e:React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        setSerchDropDown("block")
        e.target.value.length === 0 && setSerchDropDown("none")
    }, [])

    const handleCloseSearchForm = useCallback((e) => {
        setSerchDropDown("none")
    }, [])

    const handleShowNotificationBox = ()=>{
        setShowNotificationBox(!showNotificationBox)
        dispatch(setReadNotification(unReadNotificationsCount))
        console.log(unReadNotificationsCount)
    }
    


    const handleLogout = useCallback(() => { 
        try{
            authService.signOut()
            toast.info("Logout complete")
        }
        catch(err:any){
            toast.error(err.message)
        }
    },[])

    return (
        <header style={{ border: "0.5px solid rgb(200, 200, 200)", backgroundColor: "white" }}>
            <nav className="navbarContainer" style={{ display: 'flex', justifyContent: 'center', height: "53px", position: "relative", paddingLeft: "20px" }}>
                <Navbar.Brand><Link to="/"><img src={`${process.env.PUBLIC_URL}/assets/images/instaLogo.png`} width="108" height="35" style={{ marginTop: "5px" }} /></Link></Navbar.Brand>
                <div className="searchResultBox" style={{
                    backgroundColor: "white", position: "absolute", top: "60px", width: "380px", height: "350px",
                    zIndex: "1", border: "0.5px solid rgb(220, 220, 220)", borderRadius: "6px", display: serchDropDown, overflowY: "scroll"
                }} onMouseLeave={handleCloseSearchForm}>
                    <SerchForm searchTerm={searchTerm} />
                </div>
                <Form className="searchFromContainer" style={{ margin: '7px 0 0 230px', position: "relative" }}>
                    <FormControl type="search" placeholder="search..."  style={{
                        backgroundColor: "rgb(236, 236, 236)",
                        marginBottom: "5px", borderRadius: "6px"
                    }} value={searchTerm} onChange={handleSerchTerm} />
                </Form>
                <Nav className="navbarIcons" style={{ margin: "5px 0 0 150px", position: "relative" }}>
                    {window.location.pathname === '/' ? 
                    <Nav.Link style={{ marginRight: "-10px" }}><Link to=""><AiFillHome size="27" color='black' /></Link></Nav.Link>
                      : 
                      window.location.pathname === '/login' ? 
                    <Nav.Link style={{ marginRight: "-10px" }}><Link to=""><AiFillHome size="27" color='black' /></Link></Nav.Link>
                     : <Nav.Link style={{ marginRight: "-10px" }}><Link to=""><AiOutlineHome size="27" color='black' /></Link></Nav.Link>
                    }
                    {window.location.pathname === '/direct-message' ? 
                    <Nav.Link style={{ marginRight: "-10px" }}><Link to="/direct-message"><FaPaperPlane size="23" color='black' /></Link></Nav.Link>
                      : <Nav.Link style={{ marginRight: "-10px" }}><Link to="/direct-message"><FaRegPaperPlane size="23" color='black' /></Link></Nav.Link>
                    }
                    {
                        unReadMessagesCount - readMessagesCount > 0 && <div className="chatNotification" style={{
                            backgroundColor: "rgb(226, 55, 55)", borderRadius: "100%", width: "20px", height: "20px", position: "absolute",
                            left: "75px", textAlign: "center", color: "white"
                        }}>
                            {unReadMessagesCount - readMessagesCount}</div>
                    }
                    {
                        showUploadModal ? <Nav.Link style={{ marginRight: "-10px" }} onClick={handleShowUploadModal}><AiFillPlusSquare size="25" color='black' /></Nav.Link>
                        : <Nav.Link style={{ marginRight: "-10px" }} onClick={handleShowUploadModal}><FiPlusSquare size="25" color='black' /></Nav.Link>
                    }
                    {
                        showNotificationBox ? <Nav.Link style={{ marginRight: "-15px"}} onClick={handleShowNotificationBox}><AiFillHeart size="25" color='black' /></Nav.Link>
                        : <Nav.Link style={{ marginRight: "-15px"}} onClick={handleShowNotificationBox}><AiOutlineHeart size="25" color='black' /></Nav.Link>
                    }
                    {
                        unReadNotificationsCount-readNotificationsCount > 0 && <div className="chatNotification" style={{
                            backgroundColor: "rgb(226, 55, 55)", borderRadius: "100%", width: "20px", height: "20px", position: "absolute",
                            right: "57px", textAlign: "center", color: "white",fontSize:"13px"
                        }}>
                            {unReadNotificationsCount-readNotificationsCount}</div>
                    }
                    {
                        showNotificationBox ? <Notification setShowNotificationBox={setShowNotificationBox} /> : null
                    }
                    <Nav.Link style={{ marginRight: "-10px" }}><Link to=""><img src={currentUser && currentUser.photoURL} width={25} height={25} style={{ borderRadius: "100%", border: "1px solid black" }} />
                    </Link></Nav.Link>
                    <NavDropdown title="" id="basic-nav-dropdown" style={{ marginLeft: "-22px" }}>
                        <div className='navDropDownTab1'><Link style={{ color: "black" }} to="/myprofile"><div style={{ fontSize: "13px", height: "30px", margin: "0 0 0 15px" }} ><CgProfile style={{ marginTop: '-3px' }} size="17" color='black' />&nbsp;&nbsp;&nbsp;profile</div></Link></div>
                        <div className='navDropDownTab2'><Link style={{ color: "black" }} to="/myprofile-setting"><div style={{ fontSize: "13px", height: "30px", margin: "0 0 0 15px" }} ><FiSettings style={{ marginTop: '-3px' }} size="17" />&nbsp;&nbsp;&nbsp; setting</div></Link></div>
                        <div className='navDropDownTab3'><div style={{ fontSize: "13px", height: "30px", margin: "0 0 0 15px", cursor: "pointer" }} onClick={handleLogout} ><GrPowerCycle style={{ marginTop: '-3px' }} size="17" />&nbsp;&nbsp;&nbsp;switch account</div></div>
                        <NavDropdown.Item style={{ fontSize: "13px", borderTop: "1px solid rgb(200, 200, 200)" }} onClick={handleLogout}>log out</NavDropdown.Item>
                    </NavDropdown >
                </Nav >
            </nav>
            {
                showUploadModal ? <FileUpload showUploadModal={showUploadModal} handleCloseUploadModal={handleCloseUploadModal} /> : null
            }
        </header>
    )
}

export default NavbarComponent

