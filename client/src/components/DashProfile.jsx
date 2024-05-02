import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { app } from "../Firebase.js";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  signOut,
  userDeleteFail,
  userDeleteStart,
  userDeleteSuccess,
  userUpdateFail,
  userUpdateStart,
  userUpdateSuccess,
} from "../redux/user/userSlice.js";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashProfile = () => {
  const { currentUser, error } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const filePickerRef = useRef();
  const [imageUploadingProgress, setImageUploadingProgress] = useState(null);
  const [imageUploadingError, setImageUploadingError] = useState(null);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
          setFormData({ ...formData, profilePicture: downloadURL });
        });
        setImageUploadingProgress(null);
        setImageFile(null);
      }
    );
  };

  //handle form data change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  //handle Update User Profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    //if there is no changes
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No Changes Made");
      return;
    }

    if (imageUploadingProgress) {
      setUpdateUserError("Please wait image is uploading..!");
      return;
    }

    if (formData.password.trim() === "") {
      setUpdateUserError("Password cannot contain space...!");
      return;
    }

    try {
      dispatch(userUpdateStart());

      const res = await fetch(`api/user/update/${currentUser.user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setUpdateUserError(data.message);
        dispatch(userUpdateFail(data.message));
      } else {
        setUpdateUserSuccess(data.message);
        dispatch(userUpdateSuccess(data));
      }
    } catch (error) {
      dispatch(userUpdateFail(error.message));
      return;
    }
  };

  //handle delete user
  const handleUserDelete = async () => {
    setShowModal(false);
    try {
      dispatch(userDeleteStart());
      const res = await fetch(`api/user/delete/${currentUser.user._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(userDeleteFail(data.message));
      } else {
        dispatch(userDeleteSuccess());
      }
    } catch (error) {
      dispatch(userDeleteFail(error.message));
    }
  };

  //signout
  const handleSignout = async () => {
    try {
      const res = await fetch("/api/auth/signOut", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        console.log(data);
      } else {
        dispatch(signOut());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="text-center my-7 font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
          defaultValue={currentUser.user.username}
          onChange={handleChange}
          required
        />
        <TextInput
          type="email"
          id="email"
          defaultValue={currentUser.user.email}
          onChange={handleChange}
          required
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-3">
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleSignout}>
          Sign Out
        </span>
      </div>
      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 mb-4 mx-auto text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400 ">
              Are you sure you want to delete your account ?
            </h3>
          </div>
          <div className="flex flex-row-reverse gap-4">
            <Button color="failure" onClick={handleUserDelete}>
              Yes, I'm sure
            </Button>
            <Button
              className="bg-gray-400 text-white"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
