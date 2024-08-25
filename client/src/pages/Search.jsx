import React, { useEffect, useState } from "react";
import { Button, Select, TextInput } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import PostCard from "./../components/PostCard";

const Search = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    order: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const orderFromUrl = urlParams.get("order") || "desc";
    const categoryFromUrl = urlParams.get("category") || "uncategorized";

    if (searchTermFromUrl || orderFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        order: orderFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();

      try {
        const res = await axios.get(`/api/post/getAll-posts?${searchQuery}`);
        if (!res.data.success) {
          console.log("Something went wrong..!");
          return;
        }
        if (res.data.success) {
          setPosts(res.data.posts);
          if (posts.length > 9) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }

    if (e.target.id === "order") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, order: order });
    }

    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({ ...sidebarData, category: category });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("order", sidebarData.order || "desc");
    urlParams.set("category", sidebarData.category || "uncategorized");

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async (e) => {
    e.preventDefault();

    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();

    try {
      const res = await axios.get(`/api/post/getAll-posts?${searchQuery}`);
      if (!res.data.success) {
        console.log("Something went wrong..!");
        return;
      }
      if (res.data.success) {
        setPosts(res.data.posts);
        if (posts.length > 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="p-5 border-b md:border-r md:min-h-screen border-gray-500">
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <div className="flex items-center gap-2">
              <label className="whitespace-nowrap font-semibold">
                Search Term :
              </label>
              <TextInput
                type="text"
                placeholder="Search..."
                id="searchTerm"
                value={sidebarData.searchTerm}
                onChange={handleChange}
              />
            </div>
            <div className="">
              <label>order :</label>
              <Select
                onChange={handleChange}
                value={sidebarData.order}
                id="order"
              >
                <option value="desc">Latest</option>
                <option value="asc">Oldest</option>
              </Select>
            </div>
            <div className="">
              <label>order :</label>
              <Select
                onChange={handleChange}
                value={sidebarData.category}
                id="category"
              >
                <option value="uncategorized">Uncategorized</option>
                <option value="reactjs">React.js</option>
                <option value="nextjs">Next.js</option>
                <option value="javascript">Javascript</option>
              </Select>
            </div>
            <Button type="submit">Apply</Button>
          </form>
        </div>
        <div className="w-full">
          <h1 className="text-3xl font-semibold p-2 sm:border-b border-gray-500">
            Posts results :
          </h1>
          <div className="flex flex-wrap gap-3 p-5">
            {!loading && posts.length === 0 && (
              <p className="text-xl text-gray-500 font-semibold">
                No post found
              </p>
            )}
            {loading && <p className="text-xl text-gray-500">Loading...</p>}
            {!loading &&
              posts &&
              posts.map((post) => <PostCard key={post._id} post={post} />)}
            {showMore && (
              <button
                className="text-teal-500 text-lg hover:underline p-5 w-full"
                onClick={handleShowMore}
              >
                Show more
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
