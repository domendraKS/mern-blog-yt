import { Alert, Button, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Comments from "./Comments";

const CommentsSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [postComments, setPostComments] = useState([]);
  const navigate = useNavigate();

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (comment.trim().length === 0 || comment.trim().length > 200) {
      setCommentError("Fill the comment area..!");
      return;
    }
    setLoading(true);
    setCommentError(null);

    try {
      const res = await axios.post("/api/comment/create", {
        content: comment,
        postId,
        userId: currentUser.user._id,
      });

      if (res.data.success) {
        setComment("");
        setCommentError(null);
        setPostComments([res.data.comment, ...postComments]);
      }
    } catch (error) {
      setCommentError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getCommetns = async () => {
      try {
        const res = await axios.get(`/api/comment/getPostComments/${postId}`);

        if (res.data.success) {
          setPostComments(res.data.comments);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCommetns();
  }, [postId]);

  const handleLike = async (commentId) => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

    try {
      const response = await axios.put(`/api/comment/likeComment/${commentId}`);

      if (response.data.success) {
        const data = response.data.comment;
        setPostComments(
          postComments.map((commnt) =>
            commnt._id === commentId
              ? {
                  ...commnt,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : commnt
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto w-full p-3">
        {currentUser ? (
          <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
            <p>Signed in as:</p>
            <img
              className="h-5 w-5 object-cover rounded-full"
              src={currentUser.user.profilePicture}
              alt={currentUser.user.username}
            />
            <Link
              to="/dashboard?tab=profile"
              className="text-xs text-cyan-500 hover:underline"
            >
              @{currentUser.user.username}
            </Link>
          </div>
        ) : (
          <div className="text-sm text-teal-500 flex gap-2">
            You must be signed in to comment.
            <Link to="/sign-in" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </div>
        )}
        {currentUser && (
          <form
            onSubmit={handleCommentSubmit}
            className="border border-teal-500 rounded-md p-3"
          >
            <Textarea
              placeholder="Add a comment..."
              rows={3}
              maxLength="200"
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            <div className="flex justify-between items-center mt-5 mb-2">
              <p className="text-gray-400 text-xs">
                {200 - comment.length} character remaining
              </p>
              <Button
                type="submit"
                outline
                gradientDuoTone="purpleToBlue"
                disabled={loading}
              >
                Submit
              </Button>
            </div>
            {commentError && <Alert color="failure">{commentError}</Alert>}
          </form>
        )}
        {postComments.length === 0 ? (
          <p className="text-sm text-center my-3 text-black dark:text-teal-400">
            No comments yet
          </p>
        ) : (
          <>
            <div className="my-3 flex items-center gap-2">
              <p className="inline">Comments </p>
              <div className="border border-gray-600 px-1 rounded-sm">
                <p> {postComments.length}</p>
              </div>
            </div>
            {postComments.map((cmt) => (
              <Comments key={cmt._id} comment={cmt} onLike={handleLike} />
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default CommentsSection;
