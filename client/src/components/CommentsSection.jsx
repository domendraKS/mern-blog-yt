import { Alert, Button, Textarea } from "flowbite-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

const CommentsSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [commentError, setCommentError] = useState(null);

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
      }
    } catch (error) {
      setCommentError(error.response.data.message);
    } finally {
      setLoading(false);
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
      </div>
    </>
  );
};

export default CommentsSection;
