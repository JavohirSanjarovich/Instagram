import React,{useState,useEffect} from 'react'
import {databaseService} from '../../fbase';
import {Link} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {RootState} from '../../redux/_reducers'

interface IProps {
  searchTerm:string
}

function SerchFrom({searchTerm}:IProps){

    const [users,setUsers] = useState<Array<any>>([]);
    const currentUser = useSelector((state:RootState) => state.user.currentUser)

    useEffect(() => {
        addUserListeners()
        return () => {
          databaseService.ref("users").off()
        };
      }, [])

      const addUserListeners = async () => {
        try {
          const userArray: string[] = [];
            await databaseService.ref("users").on("child_added", DataSnapshot => {
                userArray.push(DataSnapshot.val())
                setUsers(userArray)
            })
        }
        catch (err) {
          console.log(err)
        }
      }

  return <div style={{ marginTop: "10px" }}>
    {users.map((user) => {
      if (user.name.includes(searchTerm) && searchTerm !== "") {
        if (user.id === currentUser.uid) {
          return <Link to={"/myprofile"} key={user.id}>
            <div style={{ display: "flex", cursor: "pointer" }} className="serchCard" key={user.id}>
              <img src={user.image} width={45} height={45} style={{ borderRadius: "100%", margin: "5px 0 5px 15px" }} />
              <div style={{ margin: "15px 0 0 10px", color: "gray" }}>{user.name}</div>
            </div>
          </Link> 
            }
            else {
              return <Link to={"/profile/" + user.id} key={user.id}>
                <div style={{ display: "flex", cursor: "pointer" }} className="serchCard" key={user.id}>
                  <img src={user.image} width={45} height={45} style={{ borderRadius: "100%", margin: "5px 0 5px 15px" }} />
                  <div style={{ margin: "15px 0 0 10px", color: "gray" }}>{user.name}</div>
                </div>
              </Link>
            }
          }
        })}
    </div>;
}

export default SerchFrom;
