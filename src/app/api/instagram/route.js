// import { NextResponse } from "next/server";
// import axios from 'axios';

// const INSTAGRAM_USER_ID = '8840100259422388'; // Use the App-Scoped User ID
// const INSTAGRAM_ACCESS_TOKEN = 'IGAAYIKmxsQN5BZAE9ldHRKTHFadWlpMlBkaXQ1MW1ZATnhoNnY2VjhFVExEemt4Um9iZAndLWnliSVVIUUc1RnJ2RE5rdXVfVUZABZAllaX0FRVTY0YVFmSjlvZAGxaTkpXMUFYMzFzb21FbmxWZAV9WSkpwdDR3M2dDckpIcng2LXBOYwZDZD'; // Your access token

// export async function GET(request) {
//   try {
//     // Step 1: Fetch media IDs
//     const mediaUrl = `https://graph.instagram.com/${INSTAGRAM_USER_ID}/media?access_token=${INSTAGRAM_ACCESS_TOKEN}`;
//     const mediaResponse = await axios.get(mediaUrl);
    
//     // Step 2: Fetch media details for each media ID
//     const mediaDetailsPromises = mediaResponse.data.data.map(async (media) => {
//       const mediaId = media.id;
//       const mediaDetailUrl = `https://graph.instagram.com/${mediaId}?fields=id,media_type,media_url,thumbnail_url,caption&access_token=${INSTAGRAM_ACCESS_TOKEN}`;
//       const mediaDetailResponse = await axios.get(mediaDetailUrl);
//       return mediaDetailResponse.data;
//     });

//     // Wait for all media details to be fetched
//     const mediaDetails = await Promise.all(mediaDetailsPromises);

//     // Step 3: Filter for images
//     const imageMedia = mediaDetails.filter(media => media.media_type === 'IMAGE');

//     return NextResponse.json(imageMedia, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching media from Instagram API:", error.response ? error.response.data : error.message);
//     return NextResponse.json({ error: "Failed to fetch media from Instagram API" }, { status: 500 });
//   }
// }



// Image and video both
import { NextResponse } from "next/server";
import axios from "axios";

const INSTAGRAM_USER_ID = "8840100259422388"; // Your Instagram App-Scoped User ID
const INSTAGRAM_ACCESS_TOKEN = "IGAAYIKmxsQN5BZAE9ldHRKTHFadWlpMlBkaXQ1MW1ZATnhoNnY2VjhFVExEemt4Um9iZAndLWnliSVVIUUc1RnJ2RE5rdXVfVUZABZAllaX0FRVTY0YVFmSjlvZAGxaTkpXMUFYMzFzb21FbmxWZAV9WSkpwdDR3M2dDckpIcng2LXBOYwZDZD"; // Your access token

export async function GET(request) {
  try {
    // Step 1: Fetch profile details
    const profileUrl = `https://graph.instagram.com/${INSTAGRAM_USER_ID}?fields=id,username,profile_picture_url,biography&access_token=${INSTAGRAM_ACCESS_TOKEN}`;
    
    const profileResponse = await axios.get(profileUrl);
    const profileData = profileResponse.data;

    // Step 2: Fetch media IDs
    const mediaUrl = `https://graph.instagram.com/${INSTAGRAM_USER_ID}/media?access_token=${INSTAGRAM_ACCESS_TOKEN}`;
    const mediaResponse = await axios.get(mediaUrl);

    // Step 3: Fetch media details for each media ID
    const mediaDetailsPromises = mediaResponse.data.data.map(async (media) => {
      const mediaId = media.id;
      const mediaDetailUrl = `https://graph.instagram.com/${mediaId}?fields=id,media_type,media_url,thumbnail_url,caption,permalink&access_token=${INSTAGRAM_ACCESS_TOKEN}`;
      const mediaDetailResponse = await axios.get(mediaDetailUrl);
      return mediaDetailResponse.data;
    });

    // Wait for all media details to be fetched
    const mediaDetails = await Promise.all(mediaDetailsPromises);

    // Step 4: Filter for images and videos
    const mediaList = mediaDetails.filter(
      (media) => media.media_type === "IMAGE" || media.media_type === "VIDEO"
    );

    return NextResponse.json(
      {
        profile: {
          id: profileData.id,
          username: profileData.username,
          profile_picture_url: profileData.profile_picture_url,
          biography: profileData.biography,
        },
        media: mediaList
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Error fetching data from Instagram API:",
      error.response ? error.response.data : error.message
    );
    return NextResponse.json(
      { error: "Failed to fetch data from Instagram API" },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  try {
    const reqBody = await request.json();
    const mediaId = reqBody.id;

    if (!mediaId) {
      return NextResponse.json({ error: "Media ID is required" }, { status: 400 });
    }

    // Fetch media details
    const mediaUrl = `https://graph.instagram.com/${mediaId}?fields=id,media_type,media_url,thumbnail_url,caption,permalink,like_count&access_token=${INSTAGRAM_ACCESS_TOKEN}`;
    const mediaResponse = await axios.get(mediaUrl);
    const mediaData = mediaResponse.data;

    // Fetch user profile details
    const userUrl = `https://graph.instagram.com/me?fields=id,username,profile_picture_url&access_token=${INSTAGRAM_ACCESS_TOKEN}`;
    const userResponse = await axios.get(userUrl);
    const userData = userResponse.data;

    // Fetch comments
    const commentsUrl = `https://graph.instagram.com/${mediaId}/comments?fields=id,text,username,timestamp&access_token=${INSTAGRAM_ACCESS_TOKEN}`;
    const commentsResponse = await axios.get(commentsUrl);
    const commentsData = commentsResponse.data;

    return NextResponse.json(
      {
        ...mediaData,
        username: userData.username,
        profile_picture: userData.profile_picture_url,
        comments: commentsData.data || [], // Ensure comments exist
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching Instagram media:", error.response?.data || error.message);
    return NextResponse.json({ error: "Failed to fetch media details" }, { status: 500 });
  }
}