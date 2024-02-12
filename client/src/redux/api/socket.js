import io from 'socket.io-client';

const URL = import.meta.env.VITE_API_BASE_URL;


let socket = io(URL, {
    autoConnect: false,
    auth: (cb) => {
        cb({ token: localStorage.token })
      }
});



export default socket;