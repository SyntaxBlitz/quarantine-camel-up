import { v4 as uuid } from 'uuid';
import io from 'socket.io-client'; 

let dispatch = null;
const setDispatch = d => dispatch = d;

// we're just gonna let it throw if this isn't initialized down the road
let socket = null;

// TODO load from localstorage
const id = uuid();

const connect = () => {
  socket = io('http://localhost:3511/');
  socket.emit('REGISTER_SOCKET', {
    id,
  });

  socket.on('UPDATE', newState => {
    console.log(newState);
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

// let the server take care of rejecting if it's not my turn
const roll = () => {
  socket.emit('ROLL', {
    id,
  });
};

const placeShortTermBet = color => {
  socket.emit('SHORT_TERM_BET', {
    id,
    color,
  });
};

const placeMirageOasis = type => spot => {
  socket.emit('PLACE_MIRAGE_OASIS', {
    id,
    type,
    spot,
  });
};

export {
  setDispatch,
  connect,
  setName,
  roll,
  placeShortTermBet,
  placeMirageOasis,
};