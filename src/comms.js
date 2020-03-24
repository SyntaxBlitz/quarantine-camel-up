import { v4 as uuid } from 'uuid';
import io from 'socket.io-client'; 

let dispatch = null;
const setDispatch = d => dispatch = d;

// we're just gonna let it throw if this isn't initialized down the road
let socket = null;

const id = uuid();

const connect = () => {
  socket = io('http://localhost:3511/');
  socket.emit('REGISTER_SOCKET', {
    id,
  });

  socket.on('UPDATE', newState => {
    dispatch({
      type: 'SET_ENTIRE_STATE', // hey, you wanna fight me? come fight me. oh, wait, you can't, because you're NOT ALLOWED OUT OF THE HOUSE.
      newState,
    });
  });
};

const setName = name => {
  socket.emit('SET_NAME', {
    id,
    name,
  });
};

window.startGame = () => {
  socket.emit('START_GAME');
};

export {
  setDispatch,
  connect,
  setName,
};