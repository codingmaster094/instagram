"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";

const InstagramHome = () => {
  const [Instagrampost, setInstagrampost] = useState([]);
  const [activeTab, setActiveTab] = useState("grid");
  useEffect(() => {
    const fetchInstagramMedia = async () => {
      try {
        const response = await axios.get("/api/instagram");
        setInstagrampost(response?.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchInstagramMedia();
  }, []);

  return (
    <div className="container mx-auto sm:p-0 lg:p-2 2xl:p-4 bg-slate-100">
      {/* Top Bar */}
      <section className="flex justify-between items-center py-2 border-b">
        <button className="text-gray-700">&#8592;</button>
        <div className="flex items-center gap-1">
          <h1 className="text-lg font-semibold">Instagram</h1>
          {Instagrampost && (
            <Image
              src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/2053557/kisspng-social-media-instagram-verified-badge-symbol-compu-5b1eedb5aba638.1612204615287535897031.jpg"
              width={20}
              height={20}
              className="rounded-full"
            />
          )}
        </div>
        <button className="text-gray-700">&#8942;</button>
      </section>

      {/* Stats */}
      <section className="flex flex-col items-center py-4">
        <div
          className="w-24 h-24 bg-cover rounded-full"
          style={{
            backgroundImage: `url(${
              Instagrampost && Instagrampost?.profile?.profile_picture_url
            })`,
          }}
        ></div>
        <div className="flex justify-center gap-6 mt-4">
          {[
            { value: "22", label: "Posts" },
            { value: "464", label: "Followers" },
            { value: "176", label: "Following" },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-lg font-bold">{item.value}</div>
              <div className="text-sm text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Description */}
      <section className="text-center p-4">
        <h2 className="text-lg font-semibold">Instagram</h2>
        <p>Bringing you closer to the people and things you love. ❤️</p>
        <a
          href="https://www.antibullyingpro.com/resources"
          className="text-blue-500"
        >
          www.antibullyingpro.com/resources
        </a>
      </section>

      {/* Actions */}
      <section className="flex justify-center gap-4 py-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Follow
        </button>
        <button className="border px-4 py-2 rounded">Message</button>
        <button className="border px-4 py-2 rounded">
          &#9660;
        </button>
      </section>

      {/* Stories */}
      <section className="flex overflow-x-auto gap-4 py-4">
        {[
          {
            img: "https://images.unsplash.com/photo-1431512284068-4c4002298068",
            desc: "Game On",
          },
          {
            img: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
            desc: "Take a Stand",
          },
          {
            img: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
            desc: "You got this",
          },
        ].map((story, index) => (
          <div key={index} className="text-center">
            <div
              className="w-16 h-16 bg-cover rounded-full border-2 border-pink-500"
              style={{ backgroundImage: `url('${story.img}')` }}
            ></div>
            <p className="text-xs mt-1">{story.desc}</p>
          </div>
        ))}
      </section>

      {/* Tabs */}
      <section className="flex justify-center gap-4 border-t py-4">
        {[
          { name: "grid", label: "Images" },
          { name: "igtv", label: "Videos" },
        ].map((tab) => (
          <button
            key={tab.name}
            className={`p-2 ${activeTab === tab.name ? "border-b-2 border-blue-500" : ""}`}
            onClick={() => setActiveTab(tab.name)}
          >
            <Image
              src={`https://s3-us-west-2.amazonaws.com/s.cdpn.io/2053557/${tab.name}-icon.png`}
              alt={`${tab.label} icon`}
              width={24}
              height={24}
            />
          </button>
        ))}
      </section>

      {/* Grid Photos & Videos */}
      <section className="grid grid-cols-3 gap-1 p-2">
        {Instagrampost?.media
          ?.filter(photo => 
            activeTab === "grid" ? photo.media_type !== "VIDEO" : photo.media_type === "VIDEO"
          )
          .map((photo, index) => (
            photo.media_type === "VIDEO" ? (
              <video key={index} className="w-[300px] h-[200px]" controls>
                <source src={photo?.media_url} type="video/mp4" />
              </video>
            ) : (
              <Link key={index} href={`/${photo.id}`}>
                <Image src={photo?.media_url} className="w-full h-32 bg-cover" width={200} height={300} />
              </Link>
            )
          ))}
      </section>
    </div>
  );
};

export default InstagramHome;
