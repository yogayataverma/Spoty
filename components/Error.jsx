import { signIn } from "next-auth/react"

const Error = () => {
    return (
        <div className='w-full h-screen flex items-center justify-center bg-black'>
            <button className="text-white px-8 py-2 rounded-full bg-red-500 font-bold text-lg" >Please Activate Spotify Background Service</button>
        </div>
    );
}

export default Error;