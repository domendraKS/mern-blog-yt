import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Modal, Table, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashComments = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdForDelete, setCommentIdForDelete] = useState(null);

  const fetchComments = async () => {
    try {
      const res = await axios.get("/api/comment/getComments");
      if (res.data.success) {
        setComments(res.data.comments);
        if (res.data.totalComments < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (currentUser.user.isAdmin) {
      fetchComments();
    }
  }, []);

  const handleShowMore = async () => {
    const startIndex = comments.length;

    try {
      const res = await axios.get(
        `/api/comment/getComments?startIndex=${startIndex}`
      );

      if (res.data.success) {
        setComments((prev) => [...prev, ...res.data.comments]);
        if (res.data.totalComments < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentDelete = async () => {
    setShowModal(false);
    try {
      const res = await axios.delete(
        `/api/comment/deleteComment/${commentIdForDelete}/`
      );

      if (res.data.success) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdForDelete)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-100">
        {currentUser.user.isAdmin && comments.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Date Updated</Table.HeadCell>
                <Table.HeadCell>Comment Content</Table.HeadCell>
                <Table.HeadCell>Number of Likes</Table.HeadCell>
                <Table.HeadCell>PostId</Table.HeadCell>
                <Table.HeadCell>UserId</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                <Table.HeadCell>
                  <span>Edit</span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {comments.map((cmt, index) => (
                  <Table.Row
                    key={index}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>
                      {new Date(cmt.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>{cmt.content}</Table.Cell>
                    <Table.Cell>{cmt.numberOfLikes}</Table.Cell>
                    <Table.Cell>{cmt.postId}</Table.Cell>
                    <Table.Cell>{cmt.userId}</Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setCommentIdForDelete(cmt._id);
                        }}
                        className="font-medium text-red-500 cursor-pointer hover:underline"
                      >
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`/update-post/${cmt._id}`}
                        className="text-teal-500 font-medium cursor-pointer hover:underline"
                      >
                        <span>Edit</span>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            {showMore && (
              <button
                className="w-full text-teal-500 self-center"
                onClick={handleShowMore}
              >
                Show More
              </button>
            )}
          </>
        ) : (
          <p>You have no comments yet..!</p>
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
                Are you sure you want to delete this post ?
              </h3>
            </div>
            <div className="flex flex-row-reverse gap-4">
              <Button color="failure" onClick={handleCommentDelete}>
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
    </>
  );
};

export default DashComments;
