import React from 'react'
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import PlaylistView from "../components/PlaylistView";
import Search from "../components/Search";
import Library from "../components/Library";
import Artist from "../components/Artist";
import Player from "../components/Player";
import Categories from "../components/Categories";

export default function Home() {
  return (
    <>
    <main className="flex w-full h-screen overflow-hidden bg-black text-white text-2xl">
  <Sidebar 
  view={view}
  setView={setView}
  setGlobalPlaylistId={setGlobalPlaylistId}
  />
  {view === 'home' && <Search
  setView={setView}
  setGlobalPlaylistId={setGlobalPlaylistId}
  setGlobalCurrentSongId={setGlobalCurrentSongId}
  setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
  setGlobalArtistId={setGlobalArtistId}
  />}
  {view === 'playlist' && <PlaylistView
  globalPlaylistId={globalPlaylistId}
  setGlobalCurrentSongId={setGlobalCurrentSongId}
  setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
  />}
  {view === "search" && <Search
  setView={setView}
  setGlobalPlaylistId={setGlobalPlaylistId}
  setGlobalCurrentSongId={setGlobalCurrentSongId}
  setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
  setGlobalArtistId={setGlobalArtistId}
  />}
  {view === "library" && <Library
  setView={setView}
  setGlobalPlaylistId={setGlobalPlaylistId}
  />}
  {view === "artist" && <Artist
  setView={setView}
  globalArtistId={globalArtistId}
  setGlobalArtistId={setGlobalArtistId}
  setGlobalCurrentSongId={setGlobalCurrentSongId}
  setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
  />}
</main>
<div className="sticky z-20 bottom-0 h-24 w-full ">
  <Player 
  globalCurrentSongId={globalCurrentSongId}
  setGlobalCurrentSongId={setGlobalCurrentSongId}
  setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
  globalIsTrackPlaying={globalIsTrackPlaying}
  />
</div>
    </>
  )
}
