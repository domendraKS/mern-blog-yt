import moment from "moment";
import React, { useEffect, useState } from "react";

const Comments = ({ comment }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/getUser/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [comment]);

  return (
    <>
      <div className="flex items-center gap-2 p-2 border-b border-gray-400 dark:border-gray-600">
        <div className="flex-shrink-0 mr-2">
          <img
            src={user.profilePicture}
            alt={user.username}
            className="w-10 h-10 rounded-full bg-gray-200"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-xs mr-1 truncate">
              {user ? `@${user.username}` : "anonymous user"}
            </span>
            <span className="text-sm text-gray-500">
              {moment(comment.createdAt).fromNow()}
            </span>
          </div>
          <p className="text-gray-600 pb-1">{comment.content}</p>
          <div className="">
            {/* <SlLike /> */}
            <p></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Comments;
