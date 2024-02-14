import { signIn , useSession } from "next-auth/react"
import { useEffect, useState } from "react";
import Error from "../components/Error";

const Login = () => {

    
    const { data: session } = useSession()
    const [playlists1, setPlaylists1] = useState()

    useEffect(() => {
      async function f() {
          if (session && session.accessToken) {
              const response = await fetch("https://api.spotify.com/v1/me/player/devices", {
                  headers: {
                      Authorization: `Bearer ${session.accessToken}`
                  }
              })
              const data = await response.json()
              setPlaylists1(data.devices[0].is_active)
              console.log(data.devices[0].is_active)
              console.log(playlists1)
          }
      }
      f()
  }, [session])
  
    return (
        <div className='w-full h-screen flex items-center justify-center bg-black'>
            {
                <div>
                <div className="text-white px-8 py-2 rounded-full bg-red-500 font-bold text-lg">Please Start Your Spotify</div>
                <br/>
                <button className="text-white px-8 py-2 ml-5 rounded-full bg-red-500 font-bold text-lg" onClick={() => signIn('spotify', { callbackUrl: "/" })}>Login with ❀ Spoty</button> 
                </div>
               
            }
            
        </div>
    );
}

export default Login;