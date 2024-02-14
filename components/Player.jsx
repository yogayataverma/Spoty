import React, { useEffect , useState } from 'react'
import {PlayCircleIcon , PauseCircleIcon} from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';

export default function Player({ globalCurrentSongId, setGlobalCurrentSongId, globalIsTrackPlaying, setGlobalIsTrackPlaying }) {

  const {data:session} = useSession();
  const [songInfo, setSongInfo] = useState(null)
  const [audioElement, setAudioElement] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [timer, setTimer] = useState(null);
  const [currentProgress, setCurrentProgress] = useState(0); 

  async function fetchSongInfo(trackId) {
    if (trackId) {
        const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            }
        })
        const data = await response.json()
        setSongInfo(data)
        console.log(data.duration_ms)
    }

}

async function handlePlayPause() {
  if (session && session.accessToken) {
      const data = await getCurrentlyPlaying()
      if (data.is_playing) {
          const response = await fetch("https://api.spotify.com/v1/me/player/pause", {
              method: "PUT",
              headers: {
                  Authorization: `Bearer ${session.accessToken}`
              }
          })
          if (response.status == 204) {
              clearInterval(timer); 
              setGlobalIsTrackPlaying(false)
          }
      } else {

        if (currentProgress >= songInfo.duration_ms / 1000) {
            // If progress reached the end, restart progress
            setCurrentProgress(0);
        }

          const response = await fetch("https://api.spotify.com/v1/me/player/play", {
              method: "PUT",
              headers: {
                  Authorization: `Bearer ${session.accessToken}`
              }
          })
          if (response.status == 204) {
              setGlobalIsTrackPlaying(true)
              setGlobalCurrentSongId(data.item.id)
          }
      }
  }
}

async function getCurrentlyPlaying() {
  const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
          Authorization: `Bearer ${session.accessToken}`
      }
  })
  if (response.status == 204) {
      console.log("204 response from currently playing")
      return;
  }
  const data = await response.json()
  return data
}

useEffect(() => {
  // fetch song details and play song
  async function f() {
      if (session && session.accessToken) {
          if (!globalCurrentSongId) {
              // get the currently playing song from spotify
              const data = await getCurrentlyPlaying()
              setGlobalCurrentSongId(data?.item?.id)
              if (data.is_playing) {
                  setGlobalIsTrackPlaying(true)
              }
              await fetchSongInfo(data?.item?.id)
          } else {
              // get song info
              await fetchSongInfo(globalCurrentSongId)
          }
      }
  }
  f()
}, [globalCurrentSongId])

useEffect(() => {
    // Clear the timer when a new song starts playing
    if (timer) {
        clearInterval(timer);
    }
}, [globalCurrentSongId]);


useEffect(() => {

    if (timer) {
        clearInterval(timer);
        setCurrentProgress(0); // Reset progress to zero
    }

    if (songInfo) {
        const durationInSeconds = songInfo.duration_ms / 1000;
        setTimer(setInterval(() => {
            setCurrentProgress(prevProgress => {
                if (prevProgress >= durationInSeconds) {
                    clearInterval(timer); // Stop the timer when it reaches the duration
                    return prevProgress;
                }
                return prevProgress + 1; // Increment progress by 1 second
            });
        }, 1000));
    }
}, [songInfo]);

// Cleanup the timer on component unmount
useEffect(() => {
    return () => {
        if (timer) {
            clearInterval(timer);
        }
    };
}, [timer]);

console.log(audioElement?.currentTime);

  return (
    <div className='h-24 bg-neutral-800 border-t border-neutral-700 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
            <div className='flex items-center space-x-4'>
                {songInfo?.album.images[0].url && <img className='hidden md:inline h-10 w-10' src={songInfo.album.images[0].url} />}
                <div>
                    <p className='text-white text-sm'>{songInfo?.name}</p>
                    <p className='text-neutral-400 text-xs'>{songInfo?.artists[0]?.name}</p>
                </div>

                

            </div>

            <div>

            <div className='flex'>
            <div className='mt-3'>{formatTime(currentProgress)}</div>
            <div class="ml-2 mr-3 w-full bg-gray-200 rounded-full h-2 mb-4 dark:bg-gray-700 mt-5">
            <div class="bg-gray-600 h-2 rounded-full dark:bg-gray-300" style={{ width: `${(currentProgress / (songInfo?.duration_ms / 1000)) * 100}%` }}></div>
            </div>
            <div className='mt-3'>{formatTime(songInfo?.duration_ms / 1000 || 0 )}</div>
            </div>


            <div className='flex items-center justify-center ml-500 '>
            {globalIsTrackPlaying ? <PauseCircleIcon onClick={handlePlayPause} className='h-10 w-10' /> : <PlayCircleIcon onClick={handlePlayPause} className='h-10 w-10' />}
            </div>
            </div>

            <div></div>

            <audio
                ref={audio => setAudioElement(audio)}
                src={songInfo?.preview_url}
                onEnded={handlePlayPause}
            />

        </div>
  )
}

function formatTime(seconds) {
    const format = val => `0${Math.floor(val)}`.slice(-2);
    const minutes = (seconds % 3600) / 60;

    return [minutes, seconds % 60].map(format).join(":");
}
