import React , {useRef,useState,useCallback} from 'react'
import  Modal  from 'react-bootstrap/Modal'
import {HiOutlineArrowLeft} from 'react-icons/hi'
import {GoLocation} from 'react-icons/go'
import {RiArrowDownSLine,RiArrowUpSLine} from 'react-icons/ri'
import 'bootstrap/js/dist/modal'; 
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/tooltip';
import 'bootstrap/dist/css/bootstrap.css';
// import { Button,Switch } from 'antd/Button';
import Button from "antd/lib/button";
import Switch from "antd/lib/switch";
import {storageService,firestoreService} from '../../fbase';
import firebase from '../../fbase'
import {useSelector} from 'react-redux'
import {RootState} from '../../redux/_reducers'
import SearchTagUser from "../common/SearchTagUser"
import {toast, ToastContainer} from "react-toastify";


interface IProps {
    showUploadModal:boolean;
    handleCloseUploadModal:()=>void
}
interface User{
    id:string 
    image:string 
    name:string
    
}

function FileUpload({showUploadModal,handleCloseUploadModal}: IProps ){
    const currentUser = useSelector((state:RootState) => state.user.currentUser)
    const fileUploadRef = useRef<HTMLInputElement>(null);
    const [fileURL,setFileURL] = useState("")
    const [ModalSize , setModalSize] = useState({width: "760px",marginLeft:"30%"})
    const [accessibilitySize,setAccessibilitySize] = useState({ height: "45px", borderBottom: "1px solid rgb(214, 216, 206)" })
    const [advancedSettingSize,setAdvancedSettingSize] = useState({ height: "45px", borderBottom: "1px solid rgb(214, 216, 206)"})
    const [accessibilityToggle ,setAccessibilityToggle] = useState({ display:"none" ,fontSize:"12px",padding:"0px 15px 0px 15px",color:"gray" })
    const [advancedSettingToggle,setAdvancedSettingToggle] = useState({ display:"none" ,fontSize:"16px",padding:"10px 15px 0px 15px"})
    const [acessibilityArrow,setAcessibilityArrow] = useState(true)
    const [advancedSettingArrow,setaAvancedSettingArrow] = useState(true)
    const [description,setDescription] = useState("")
    const [location,setLocation] = useState("")
    const [replacedText,setReplacedText] = useState("")
    const [commentOff,setCommentOff] = useState(false)
    const fileStorage = storageService.ref()
    const [fileType,setFileType] = useState("")
    const [searchTerm,setSearchTerm] = useState("")
    const [serchDropDown,setSerchDropDown] = useState("none")
    const [taggedUsers,setTaggedUsers] = useState<Array<User>>([]);
    const [taggedUsersId,setTaggedUsersId] = useState<Array<string>>([]);


    const handleAccessibilitySize = () => {
        if(accessibilitySize.height==="45px"){
            setAccessibilitySize({ height: "190px", borderBottom: "1px solid rgb(214, 216, 206)"})
            setAccessibilityToggle({ display:"block" ,fontSize:"12px",padding:"0px 15px 0px 15px",color:"gray" })
            setAcessibilityArrow(false)
        }
        else{
            setAccessibilitySize({ height: "45px", borderBottom: "1px solid rgb(214, 216, 206)" })
            setAccessibilityToggle({ display:"none" ,fontSize:"12px",padding:"0px 15px 0px 15px",color:"gray"  })
            setAcessibilityArrow(true)
        }      
    }

    const handleAdvancedSettingSize = () =>{
        if(advancedSettingSize.height==="45px"){
            setAdvancedSettingSize({ height: "200px", borderBottom: "0px solid rgb(214, 216, 206)"})
            setAdvancedSettingToggle({ display:"block" ,fontSize:"16px",padding:"10px 15px 0px 15px" })
            setaAvancedSettingArrow(false)
        }
        else{
            setAdvancedSettingSize({ height: "45px", borderBottom: "1px solid rgb(214, 216, 206)"})
            setAdvancedSettingToggle({ display:"none" ,fontSize:"16px",padding:"10px 15px 0px 15px" })
            setaAvancedSettingArrow(true)
        }
    }

    const handleTagbox = useCallback(()=>{
        if(serchDropDown==="block"){
            setSerchDropDown("none")
        }
        else{
            setSerchDropDown("block")
        }
    }, [serchDropDown])

    const handleSerchTerm = useCallback((e) => {
        setSearchTerm(e.target.value)
    }, [])

    const deleteTaggedUser = (user:User)=>()=> {
        const newTaggedUsers = taggedUsers.filter(usr=>usr!==user)
        setTaggedUsers(newTaggedUsers)
    }

    const handleOpenFileUpload =useCallback(() => {
        fileUploadRef.current && fileUploadRef.current.click()
    }, [])

    const handleUploadFile = async (event: { target: HTMLInputElement }) => {
        if (event.target.files)
        {
            const file = event.target.files[0]
            const metadata = {contentType: file.type}
            setFileType(file.type)

        try{ 
             let uploadTaskSnapshot = await fileStorage.child(`upload/${currentUser.uid}/${file.name}`).put(file, metadata)  
             let downloadURL = await uploadTaskSnapshot.ref.getDownloadURL() 
             setFileURL(downloadURL)
             setModalSize({ width: "1090px",marginLeft:"420px"}) 
            console.log(downloadURL)
        }catch(err){
            console.log(err)
        }
        }
    }


    const handleSubmit = async()=>{
        try{
            await firestoreService.collection("posts").add(createFile(fileURL))
            handleCloseUploadModal()
            toast.info("File upload complete")
        }catch(err:any){
            toast.error(err.message)
            setDescription("")
            setLocation("")
            setReplacedText("")
            setCommentOff(false)
            setFileURL("")
            setFileType("")
        }

    }

    const createFile = (fileUrl: string) => {
        const today = new Date()
        const yearMonthDay = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}` 
        const hourminutesecond = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
        const file = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            description:description,
            location:location,
            replacedText:replacedText,
            commentOff:commentOff,
            fileUrl: fileUrl,
            fileType:fileType,
            yearMonthDay:yearMonthDay,
            hourminutesecond:hourminutesecond,
            taggedUsersId:taggedUsersId,
            taggedUsers:taggedUsers,
            user: {
                id: currentUser.uid,
                name: currentUser.displayName,
                image:currentUser.photoURL
            },
            
        }
        return file
    }



    return (
        <>
            <ToastContainer/>
            <Modal className="fileUploadModal" size="xl" centered show={showUploadModal} onHide={handleCloseUploadModal} style={ModalSize}>
                <div style={{ height: '790px', borderRadius: '30px' }}>
                    {
                        fileURL ?
                            <>
                                <header style={{ position:"relative", height: "45px", borderBottom: "1px solid rgb(214, 216, 206)", paddingTop: "10px", fontWeight: "550", fontSize: "16px" }}>
                                    <HiOutlineArrowLeft size={25} style={{ marginLeft: "15px", cursor: "pointer" }} onClick={handleCloseUploadModal} />
                                    <button onClick={handleSubmit} style={{ color: "rgb(30, 140, 230)",position:"absolute",right:"10px" ,backgroundColor: "white", fontWeight: "bold", border: "1px solid white" }}
                                    >Share</button></header>
                                <main style={{ display: "flex",position:"relative" }}>
                                    <section className="fileInfileUploadModalContainer" >
                                    {
                                        fileType === "video/mp4" ? <video className="fileInUploadModal" src={fileURL} width={760} controls onClick={handleTagbox}/>
                                            : <img className="fileInUploadModal" src={fileURL} height={400} width={760} style={{ marginTop: "150px", cursor: "pointer" }} onClick={handleTagbox} />
                                    }
                                    <div style={{display:serchDropDown, position: "absolute", backgroundColor: "white", width: "310px", height: "220px", top: "220px", left: "250px", borderRadius: "10px", border: "1px solid rgb(214, 216, 206)"}}>
                                        <div style={{ borderBottom: "1px solid rgb(214, 216, 206)", height: "45px", padding: "10px 0 0 15px", fontSize: "15px", fontWeight: "bold" }}>
                                        tag:<input type="text" placeholder='search' style={{ marginLeft: "10px" }} value={searchTerm} onChange={handleSerchTerm}/></div>
                                        <div style={{ overflowY: "scroll" }}>
                                            <SearchTagUser searchTerm={searchTerm} setTaggedUsers={setTaggedUsers} setTaggedUsersId={setTaggedUsersId}/>
                                        </div>
                                    </div>
                                    </section>
                                    <aside className="fileInfoInfileUploadModalContainer" style={{ borderLeft: "1px solid rgb(200, 200, 200)", height: "745px", width: "350px" }}>
                                        <div style={{ height: "270px", borderBottom: "1px solid rgb(214, 216, 206)" }}>
                                            <img src={currentUser.photoURL} width={30} height={30} style={{ margin: "15px", borderRadius: "100%" }} /><span style={{ fontWeight: "bold" }}>{currentUser.displayName}</span>
                                            <textarea className="uploadTextArea" placeholder="Enter phrase..." style={{ display: "block", height: "170px", width: "100%", border: "none", fontSize: "16px", paddingLeft: "15px", fontWeight: "bold" }}
                                                onChange={(e) => setDescription(e.target.value)}></textarea>
                                        </div>
                                        <div style={{ height: "45px", borderBottom: "1px solid rgb(214, 216, 206)",position:"relative"  }}>
                                            <input type="text" placeholder="Add location" style={{ padding: "8px 15px", fontSize: "16px" }} onChange={(e) => setLocation(e.target.value)} />
                                            <GoLocation style={{ position:"absolute",top:"10px",right:"10px" }} />
                                        </div>
                                        <div style={accessibilitySize} >
                                            <div style={{ padding: "8px 14px", fontSize: "16px", cursor: "pointer",position:"relative" }} onClick={handleAccessibilitySize}>
                                            accessibility {acessibilityArrow ? <RiArrowDownSLine size={25} style={{ position:"absolute",right:"5px" }} /> : <RiArrowUpSLine size={25} style={{ position:"absolute",right:"5px" }} />}
                                            </div>
                                            <div style={accessibilityToggle}>
                                                <div>Alt text is text that explains the contents of a photo to people who have visual difficulties. Alternative text is automatically generated for your photo, or you can enter it yourself.</div>
                                                <div style={{ marginTop: "8px" }} >
                                                    {
                                                        fileType === "video/mp4" ? <video src={fileURL} width={55} />
                                                            : <img src={fileURL} height={41} width={55} />
                                                    }
                                                    <input type="text" placeholder="Enter alt text" style={{
                                                        padding: "20px 0 20px 10px", marginLeft: "10px", height: "1px", fontSize: "16px", border: "1px solid rgb(214, 216, 206)",
                                                        borderRadius: "5px", width: "232px"
                                                    }} onChange={(e) => setReplacedText(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div style={advancedSettingSize}  >
                                            <div style={{ padding: "8px 15px", fontSize: "16px", cursor: "pointer",position:"relative" }} onClick={handleAdvancedSettingSize}>
                                            advanced settings{advancedSettingArrow ? <RiArrowDownSLine size={25} style={{ position:"absolute",right:"5px" }} /> : <RiArrowUpSLine size={25} style={{ position:"absolute",right:"5px" }} />}
                                            </div>
                                            <div style={advancedSettingToggle}>
                                                <span>Disable comment function</span>
                                                <Switch defaultChecked style={{ marginLeft: "150px" }} onChange={(prev) => setCommentOff(!prev)} />
                                                <div style={{ paddingTop: "10px", fontSize: "12px", color: "gray" }}>Later menu at the top of the post(...)You can change this setting in</div>
                                            </div>
                                            {
                                                taggedUsers.length>0 && <div style={{ padding: "10px 14px", fontSize: "16px" }}>
                                                    Tagged Users:
                                                    <div style={{ fontSize: "13px",  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', paddingTop: "10px", rowGap: '10px', columnGap: '10px'}}>
                                                        {
                                                            taggedUsers.map(user =>
                                                                <div style={{
                                                                    color: "white", marginRight: "4px", backgroundColor: "black", borderRadius: "10%", width: "90px",height:"25px",paddingTop:"3px",
                                                                    textAlign: "center", cursor: "pointer"
                                                                }} key={user.id}>{user.name}<button style={{color:"white",marginLeft:"10px",border:"1px solid black",backgroundColor:"black"}}
                                                                onClick={deleteTaggedUser(user)}>x</button></div>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </aside>
                                </main>
                            </>
                            :
                            <>
                                <header className='modal1' style={{ height: "45px", borderBottom: "1px solid rgb(200, 200, 200)", textAlign: "center", paddingTop: "10px", fontWeight: "550", fontSize: "16px" }}>
                                Create a new post</header>
                                <Modal.Body>
                                    <div style={{ textAlign:"center", marginTop: "270px" }}><img src={`${process.env.PUBLIC_URL}/assets/images/upload_image.png`}/></div>
                                    <div style={{ fontSize: "22px", textAlign: "center", fontWeight: "lighter", color: "rgb(71, 71, 71)" }}>Drag and drop your photos and videos here</div>
                                    <Button type="primary" style={{ display:"block", margin:"auto" }} onClick={handleOpenFileUpload}>select from computer</Button>
                                    <input type="file" ref={fileUploadRef} onChange={handleUploadFile} style={{ display: "none" }} />
                                </Modal.Body>
                            </>
                    }
                </div>
            </Modal>
        </>
    )
}

export default FileUpload
