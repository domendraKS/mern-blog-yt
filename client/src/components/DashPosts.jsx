import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";

const DashPosts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(
        `/api/post/getAll-posts?userId=${currentUser.user._id}`
      );
      if (res.data.success) {
        setUserPosts(res.data.posts);
        if (res.data.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (currentUser.user.isAdmin) {
      fetchPosts();
    }
  }, []);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;

    try {
      const res = await axios.get(
        `/api/post/getAll-posts?userId=${currentUser.user._id}&startIndex=${startIndex}`
      );

      if (res.data.success) {
        setUserPosts((prev) => [...prev, ...res.data.posts]);
        if (res.data.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-100">
        {currentUser.user.isAdmin && userPosts.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Date updated</Table.HeadCell>
                <Table.HeadCell>Post Image</Table.HeadCell>
                <Table.HeadCell>Post Title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                <Table.HeadCell>
                  <span>Edit</span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {userPosts.map((post, index) => (
                  <Table.Row
                    key={index}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/post/${post.slug}`}>
                        <img
                          src={`${post.image}`}
                          alt={`${post.slug}`}
                          className="w-20 h-20 object-cover bg-gray-500"
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`/post/${post.slug}`}
                        className="font-medium text-gray-900 dark:text-white"
                      >
                        {post.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{post.category}</Table.Cell>
                    <Table.Cell>
                      <span className="font-medium text-red-500 cursor-pointer hover:underline">
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`/update-post/${post._id}`}
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
          <p>You have no posts yet..!</p>
        )}
      </div>
    </>
  );
};

export default DashPosts;
