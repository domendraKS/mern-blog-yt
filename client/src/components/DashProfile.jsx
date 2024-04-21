import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Alert, Button, TextInput } from "flowbite-react";
import { app } from "../Firebase.js";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const filePickerRef = useRef();
  const [imageUploadingProgress, setImageUploadingProgress] = useState(null);
  const [imageUploadingError, setImageUploadingError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const acceptedImageType = ["image/jpg", "image/jpeg", "image/png"];
    if (file && acceptedImageType.includes(file.type)) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      setImageUploadingError(null);
    } else {
      setImageUploadingError("This image is not accepted");
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageUploadingError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadingProgress(progress.toFixed(0));
        setImageUploadingError(null);
      },
      (error) => {
        setImageUploadingError(
          "Could not upload this image (file must be less than 2MB) "
        );
        setImageUploadingProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
        });
        setImageUploadingProgress(null);
        setImageFile(null);
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="text-center my-7 font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h32 self-center shadow-md rounded-full overflow-hidden cursor-pointer"
          onClick={() => filePickerRef.current.click()}
        >
          {imageUploadingProgress && (
            <CircularProgressbar
              value={imageUploadingProgress || 0}
              text={`${imageUploadingProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,199,${imageUploadingProgress}/100)`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.user.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageUploadingProgress &&
              imageUploadingProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageUploadingError && (
          <Alert color="failure">{imageUploadingError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.user.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.user.email}
        />
        <TextInput type="password" id="password" placeholder="Password" />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-3">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

export default DashProfile;
