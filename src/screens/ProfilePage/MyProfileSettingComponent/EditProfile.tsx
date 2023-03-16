import React, { useState, useRef, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/_reducers";
import { Button } from "antd";
import { useDispatch } from "react-redux";
import { changeName } from "../../../redux/_actions/user_actions";
import { userEditProfile } from "../../../redux/_actions/user_actions";
import { authService, storageService, databaseService, firestoreService } from "../../../fbase";
import { setPhotoURL } from "../../../redux/_actions/user_actions";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditProfile() {
  const user = useSelector((state: RootState) => state.user);
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [webSite, setWebSite] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const profileImgUploadRef = useRef<HTMLInputElement>(null);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    addUserProfileListeners()
    setName(user.currentUser.displayName)
    setUserName(user.currentUserProfile?.profile.username)
    setWebSite(user.currentUserProfile?.profile.webSite)
    setIntroduction(user.currentUserProfile?.profile.introduction)
    setEmail(user.currentUserProfile?.profile.email)
    setPhoneNumber(user.currentUserProfile?.profile.phoneNumber)
    setGender(user.currentUserProfile?.profile.gender)
  }, [])

  const addUserProfileListeners = async () => {
    try {
      await firestoreService.collection(`profile`).doc(currentUser.uid).onSnapshot((doc) => {
        const profile = doc.data()
        dispatch(userEditProfile(profile))
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleSubmit = async() => {
    try {
      if (name) {
        await dispatch(changeName(name)); 
        await authService.currentUser?.updateProfile({
          displayName: name,
        });
        setName(name);
      }
      const variable = {
        profile: {
          username: username,
          webSite: webSite,
          introduction: introduction,
          email: email,
          phoneNumber: phoneNumber,
          gender: gender,
        },
      };
      await dispatch(userEditProfile(variable));
      await firestoreService.collection("profile").doc(currentUser.uid).set(variable)
      toast.info("Your profile has been saved.");
      window.location.reload()
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const ChangeProfileImg = useCallback(() => {
    profileImgUploadRef.current && profileImgUploadRef.current.click();
  }, []);
  const handleProfileImgUploadFile = async (event: {
    target: HTMLInputElement;
  }) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const metadata = { contentType: file.type };
      try {
        let uploadTaskSnapshot = await storageService
          .ref()
          .child(`profileImg/${currentUser.uid}/${file.name}`)
          .put(file, metadata);
        let downloadURL = await uploadTaskSnapshot.ref.getDownloadURL(); 

        authService.currentUser?.updateProfile({
          photoURL: downloadURL,
        });
        dispatch(setPhotoURL(downloadURL)); 
        databaseService
          .ref("users")
          .child(currentUser.uid)
          .update({ image: downloadURL });
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <section
      style={{
        width: "710px",
        height: "830px",
        border: "0.5px solid rgb(210, 210, 210)",
        borderLeft: "none",
      }}
    >
      <ToastContainer />
      <div style={{ margin: "30px 0 0 123px", display: "flex" }}>
        <img
          src={currentUser.photoURL}
          style={{ borderRadius: "100%", marginLeft: "5px", cursor: "pointer" }}
          width={40}
          height={40}
          onClick={ChangeProfileImg}
        />
        <div style={{ margin: "0 0 0 27px" }}>
          <div style={{ fontSize: "17px" }}>{user.currentUser.displayName}</div>
          <div
            style={{
              fontWeight: "bold",
              marginTop: "-3px",
              color: "rgb(41, 149, 238)",
              cursor: "pointer",
            }}
            onClick={ChangeProfileImg}
          >
            Change your profile picture
          </div>
        </div>
        <input
          type="file"
          ref={profileImgUploadRef}
          onChange={handleProfileImgUploadFile}
          style={{ display: "none" }}
        />
      </div>
      <div
        style={{
          margin: "20px 0 0 132px",
          display: "flex",
          fontSize: "16px",
        }}
      >
        <span style={{ fontWeight: "bold" }}>name</span>
        <input
          type="text"
          placeholder="name"
          style={{
            width: "343px",
            padding: "3px 0 3px 10px",
            margin: "-3px 0 0 32px",
            border: "1px solid rgb(200, 200, 200)",
            borderRadius: "3px",
          }}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
      <div
        style={{
          margin: "13px 160px 10px 195px",
          fontSize: "12px",
          color: "gray",
        }}
      >
        People use your known name, such as your first name, nickname, or business name.
        to help us find your account.
      </div>
      <div
        style={{
          margin: "0 160px 20px 195px",
          fontSize: "12px",
          color: "gray",
        }}
      >
        You can only change your name twice in 14 days.
      </div>
      <div
        style={{ margin: "20px 0 0 79px", display: "flex", fontSize: "16px" }}
      >
        <span style={{ fontWeight: "bold" }}>username</span>{" "}
        <input
          type="text"
          placeholder="username"
          style={{
            width: "343px",
            padding: "3px 0 3px 10px",
            margin: "-3px 0 0 32px",
            border: "1px solid rgb(200, 200, 200)",
            borderRadius: "3px",
          }}
          value={username}
          onChange={(e) => {
            setUserName(e.target.value);
          }}
        />
      </div>
      <div
        style={{
          margin: "13px 160px 10px 195px",
          fontSize: "12px",
          color: "gray",
        }}
      >
        In most cases, you can change your username back to dltpwjd 1 within 14 days.
         there is.
        <a
          href="https://help.instagram.com/876876079327341"
          style={{
            color: "rgb(41, 149, 238)",
            marginLeft: "3px",
            fontWeight: "bold",
          }}
        >
          learn more
        </a>
      </div>
      <div
        style={{
          margin: "30px 0 0 101px",
          display: "flex",
          fontSize: "16px",
        }}
      >
        <span style={{ fontWeight: "bold" }}>Website</span>
        <input
          type="text"
          placeholder="Website"
          style={{
            width: "343px",
            padding: "3px 0 3px 10px",
            margin: "-3px 0 0 32px",
            border: "1px solid rgb(200, 200, 200)",
            borderRadius: "3px",
          }}
          value={webSite}
          onChange={(e) => {
            setWebSite(e.target.value);
          }}
        />
      </div>
      <div
        style={{
          margin: "19px 0 0 133px",
          display: "flex",
          fontSize: "16px",
        }}
      >
        <span style={{ fontWeight: "bold" }}>introduction</span>
        <textarea
          style={{
            width: "355px",
            height: "60px",
            padding: "3px 0 3px 10px",
            margin: "-3px 0 0 32px",
            border: "1px solid rgb(200, 200, 200)",
            borderRadius: "3px",
          }}
          value={introduction}
          onChange={(e) => {
            setIntroduction(e.target.value);
          }}
        />
      </div>
      <div
        style={{
          margin: "30px 0 0 197px",
          fontSize: "14px",
          fontWeight: "bold",
          color: "gray",
        }}
      >
        Privacy
      </div>
      <div
        style={{
          margin: "0 150px 10px 197px",
          fontSize: "12px",
          color: "gray",
        }}
      >
        Even if the account is used for business or pet, etc., member's personal information
        Please enter It is not included in public profiles.
      </div>
      <div
        style={{
          margin: "15px 0 0 118px",
          display: "flex",
          fontSize: "16px",
        }}
      >
        <span style={{ fontWeight: "bold" }}>email</span>
        <input
          type="text"
          placeholder="email"
          style={{
            width: "343px",
            padding: "3px 0 3px 10px",
            margin: "-3px 0 0 32px",
            border: "1px solid rgb(200, 200, 200)",
            borderRadius: "3px",
          }}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <div
        style={{
          margin: "20px 0 0 103px",
          display: "flex",
          fontSize: "16px",
        }}
      >
        <span style={{ fontWeight: "bold" }}>phone number</span>
        <input
          type="text"
          placeholder="phone number"
          style={{
            width: "343px",
            padding: "3px 0 3px 10px",
            margin: "-3px 0 0 32px",
            border: "1px solid rgb(200, 200, 200)",
            borderRadius: "3px",
          }}
          value={phoneNumber}
          onChange={(e) => {
            setPhoneNumber(e.target.value);
          }}
        />
      </div>
      <div
        style={{
          margin: "20px 0 0 135px",
          display: "flex",
          fontSize: "16px",
        }}
      >
        <span style={{ fontWeight: "bold" }}>gender</span>
        <input
          type="text"
          placeholder="gender"
          style={{
            width: "343px",
            padding: "3px 0 3px 10px",
            margin: "-3px 0 0 32px",
            border: "1px solid rgb(200, 200, 200)",
            borderRadius: "3px",
          }}
          value={gender}
          onChange={(e) => {
            setGender(e.target.value);
          }}
        />
      </div>
      {
        name === "" ? <Button
          type="primary"
          style={{
            fontWeight: "bold",
            width: "50px",
            paddingLeft: "10px",
            margin: "100px 0 0 201px",
          }}
          size={"middle"}
          onClick={handleSubmit}
          disabled
        >
          submit
        </Button> :
          <Button
            type="primary"
            style={{
              fontWeight: "bold",
              width: "50px",
              paddingLeft: "10px",
              margin: "100px 0 0 201px",
            }}
            size={"middle"}
            onClick={handleSubmit}
          >
            submit
          </Button>
      }
    </section>
  );
}

export default EditProfile;
