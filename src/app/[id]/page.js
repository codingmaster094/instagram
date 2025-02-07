'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import EmojiPicker from 'emoji-picker-react';

const Page = ({ params }) => {
  const [postData, setPostData] = useState(null);
  const [error, setError] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  // Fetch comments from db.json
  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/comments`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const newCommentData = { username: "You", text: newComment };

      try {
        await axios.post(`http://localhost:5000/comments`, newCommentData);
        setNewComment("");
        fetchComments(); // Refresh comments after adding new one
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  // Fetch Instagram post data
  useEffect(() => {
    const fetchInstagramMedia = async () => {
      try {
        const response = await axios.post(`/api/instagram`, { id: params.id });
        setPostData(response.data);
      } catch (error) {
        setError("Failed to load Instagram post.");
      }
    };

    fetchInstagramMedia();
    fetchComments(); // Load comments on component mount
  }, [params.id]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative bg-white rounded-lg w-96 h-[680px] mx-auto">
        <div className="w-full">
          <Image
            src={postData?.media_url}
            width={400}
            height={300}
            alt="Post"
            className="w-full rounded-lg"
          />
        </div>

        <div className="flex items-center justify-between p-4">
          <div className="flex space-x-4">
            <i className="bi bi-heart text-2xl cursor-pointer"></i>
            <i
              className="bi bi-chat-left text-2xl cursor-pointer"
              onClick={() => setShowComments(!showComments)}
            ></i>
            <i className="bi bi-arrow-up-right-square text-2xl cursor-pointer"></i>
          </div>
          <i className="bi bi-bookmark text-2xl cursor-pointer"></i>
        </div>

        <div className="px-4">
          <h4 className="text-sm font-bold flex items-center">
            <img
              src="https://picsum.photos/20"
              alt="User"
              className="w-5 h-5 rounded-full mr-2"
            />
            Liked by Gandijuha and 104,424 others
          </h4>
          <h4 className="text-sm font-bold mt-2">
            {postData?.username} {" : "}
            <span className="text-sm text-gray-500">{postData?.caption}</span>
          </h4>
          <h5
            className="text-xs text-gray-500 mt-1 cursor-pointer"
            onClick={() => setShowComments(!showComments)}
          >
            View all {comments.length} comments
          </h5>

          {showComments && (
            <div className="mt-2">
              {comments.map((comment, index) => (
                <p key={index} className="text-sm">
                  <span className="font-bold">{comment.username}</span>:{" "}
                  {comment.text}
                </p>
              ))}
            </div>
          )}

          {/* Add Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex items-center mt-2 relative">
            {/* Emoji Icon with Picker */}
            <div className="relative">
              <svg
                aria-label="Emoji"
                className="cursor-pointer"
                fill="currentColor"
                height="24"
                role="img"
                viewBox="0 0 24 24"
                width="24"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <title>Emoji</title>
                <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
              </svg>

              {showEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2 z-10">
                  <EmojiPicker onEmojiClick={(emojiData) => setNewComment((prev) => prev + emojiData.emoji)} />
                </div>
              )}
            </div>

            <input
              type="text"
              placeholder="Add a comment 😊😂😍💖"
              className="w-full border-none focus:outline-none text-sm p-2 ml-2"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" className="text-blue-500 text-sm font-semibold">
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
