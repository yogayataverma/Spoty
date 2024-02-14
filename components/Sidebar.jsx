import { BuildingLibraryIcon, HeartIcon, HomeIcon, MagnifyingGlassIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

const SpotifySVG = () => (
    <svg width="50" height="50">  
    <text x="0" y="39" fill="white" font-size="50" font-weight="bold" >❀</text>
    </svg>
)

const TextLogo =()=>(
    <svg width="100" height="50" >
    <text x="0" y="34" fill="white" font-size="25" font-weight="bold" >Spoty</text>
    </svg>
)


const Sidebar = ({ view, setView, setGlobalPlaylistId }) => {
    const { data: session } = useSession()
    const [playlists, setPlaylists] = useState([])
    const [playlistsh, setPlaylistsh] = useState([])
    // console.log(session.user.accessToken)
    useEffect(() => {
        async function f() {
            if (session && session.accessToken) {
                const response = await fetch("https://api.spotify.com/v1/me/playlists", {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`
                    }
                })
                const data = await response.json()
                setPlaylists(data.items)
            }
        }

        async function h() {
            if (session && session.accessToken) {
                const response = await fetch("https://api.spotify.com/v1/me/playlists", {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`
                    }
                })
                const data = await response.json()
                setPlaylistsh(data.items)
            }
        }

        f()
        h()
    }, [session])
    return (
        <div className='w-64 text-neutral-400 grow-0 shrink-0 h-screen overflow-hidden border-r border-neutral-900 p-5 text-sm hidden md:inline-flex'>
            <div className='space-y-4 overflow-hidden'>

            <div className='space-y-5 overflow-hidden'>
            <div className='flex items-center space-x-4'>
                <div className='mt-2 mb-1'>
                    <SpotifySVG />
                </div>
                <div className='mt-2 mb-1'>
                    <TextLogo />
                </div>
            </div>
            </div>

                <button onClick={() => setView("home")} className='flex items-center space-x-2 hover:text-white text-lg'>
                    <HomeIcon className='h-6 w-6 ml-2.5' />
                    <p>Home</p>
                </button>
                <button onClick={() => setView("search")} className={`flex items-center space-x-2 text-lg hover:text-white ${view == "search" ? "text-white" : null}`}>
                    <MagnifyingGlassIcon className='h-6 w-6 ml-2.5' />
                    <p>Search</p>
                </button>
                <button onClick={() => setView("library")} className={`flex items-center space-x-2 text-lg hover:text-white ${view == "library" ? "text-white" : null}`}>
                    <BuildingLibraryIcon className='h-6 w-6 ml-2.5' />
                    <p>Your Library</p>
                </button>
                <hr className='border-neutral-900' />
                <div className='overflow-hidden'>
                {
                    playlists.map((playlist) => {
                        return (
                            <p
                                onClick={() => {
                                    setView("playlist")
                                    setGlobalPlaylistId(playlist.id)
                                }}
                                key={playlist.id}
                                className='cursor-default hover:text-white w-52 truncate text-lg ml-4 mt-2'
                            >
                                {playlist.name}
                            </p>
                        )
                    })
                }
                </div>
            </div>
        </div>
    );
}

export default Sidebar;