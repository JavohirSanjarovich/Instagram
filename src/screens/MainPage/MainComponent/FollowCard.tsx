import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import {firestoreService} from '../../../fbase';
import {useSelector} from 'react-redux'
import {RootState} from '../../../redux/_reducers'

interface followUserType{
    id:string
    follow?: boolean
    fromUserId?: string
    fromUserImg?: string
    fromUserName?: string
    img?: string
    toUserId?: string
    toUserName?: string
}


function FollowCard() {
    const currentUser = useSelector((state: RootState) => state.user.currentUser)
    const [followUsers, setFollowUsers] = useState<Array<followUserType>>([]);

    useEffect(() => {
        addFollowListeners()
    }, [])

    const addFollowListeners = async () => {
        try {
            await firestoreService.collection("follow").where("fromUserId", "==", currentUser.uid).onSnapshot((snapshot) => {
                const followArray = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setFollowUsers(followArray)
            })
        } catch (err) {
            console.log(err)
        }
    }

    return <header  style={{ display: "flex",overflowX:"scroll", width: "615px", height: "120px", backgroundColor: "white", marginTop: "35px", borderRadius: "3px", border: "1px solid rgb(220, 220, 220)" }}>
        { followUsers.map((user) =>
            <div style={{ margin: "20px 0 0 20px" }} key={user.id}>
                <Link to={"/profile/" + user.toUserId}><div><img src={user.img} width={60} height={60} style={{ borderRadius: "100%" }} /></div></Link>
                <div style={{ marginLeft: "10px", color: "gray" }}>{user.toUserName}</div>
            </div>
        )}
    </header>;
}

export default FollowCard;
