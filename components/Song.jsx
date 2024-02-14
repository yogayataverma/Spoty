import React from 'react';
import { useEffect, useState } from "react";
import { PlayIcon } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Song({sno, track , setGlobalCurrentSongId , setGlobalIsTrackPlaying}) {
    const [hover, setHover] = useState(false)
    const { data: session } = useSession()

    function millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return (
            seconds == 60 ?
                (minutes + 1) + ":00" :
                minutes + ":" + (seconds < 10 ? "0" : "") + seconds
        );
    }

    async function playSong(track) {
        
        setGlobalCurrentSongId(track.id)
        setGlobalIsTrackPlaying(true)
        if (session && session.accessToken) {
            const response = await fetch("https://api.spotify.com/v1/me/player/play", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${session.accessToken}`
                },
                body: JSON.stringify({
                    uris: [track.uri]
                })
            })
            console.log("on play", response.status)
        }
    }

  return (

    <>
    <ToastContainer/>
    <div onClick={async ()=> await playSong(track)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className='grid grid-cols-2 text-neutral-400 text-sm py-4 px-5 hover:bg-white hover:bg-opacity-10 rounded-lg cursor-default'>
        <div className='flex items-center space-x-4'>
        {hover ? <PlayIcon onClick={async () => await playSong(track)} className='h-5 w-5 text-white' /> : <p className='w-5'>{sno + 1}</p>}
        <img className='h-10 w-10' src={track.album.images[0].url} />
        <p className='w-36 lg:w-64 truncate text-white text-base'>{track.name}</p>
        <p className='w-36 truncate'>
            {
                track.artists.map((artist, i) => {
                    return (
                        <>
                            <span className='hover:underline'>{artist.name}</span>
                            <span>{i != track.artists.length - 1 ? ", " : null}</span>
                        </>
                    )
                })
            }
        </p>
        </div>
        <div className='flex items-center justify-between ml-auto md:ml-0'>
                <p className='w-40 truncate hidden md:inline'>{track.album.name}</p>
                <p>{millisToMinutesAndSeconds(track.duration_ms)}</p>
        </div>
    </div>
    </>
    
  )
}
