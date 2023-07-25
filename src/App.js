
import { prettyDOM } from '@testing-library/react';
import './App.css';

//firebase SDK
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { useState,useRef } from 'react';

//Hooks
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyB8uZo2USWER_YpIRY6kkwE8xHCATfPgXg",
  authDomain: "chatonline10101.firebaseapp.com",
  projectId: "chatonline10101",
  storageBucket: "chatonline10101.appspot.com",
  messagingSenderId: "621597305291",
  appId: "1:621597305291:web:47d8d5dd60485470312e4e",
  measurementId: "G-FEZF96P2FJ",
}); 

const auth = firebase.auth(); 
const firestore = firebase.firestore(); 

function SignIn() { 
  const signInWithGoogle = ()=>{ 
    const provider = new firebase.auth.GoogleAuthProvider();
auth.signInWithPopup(provider); 
}
 
return(
  <button onClick={signInWithGoogle}>Sign in with Google</button>
)

}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
}

function ChatRoom() {
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, { idField: 'id' });
const [formValue, setFormValue] = useState("");
const bottom = useRef();

const sendMessage = async (e) => {
  //form will refresh automically after submission but this will prevent it from happening
  e.preventDefault();

  const {uid,photoURL} = auth.currentUser;
  await messagesRef.add({
    text: formValue,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    uid,
    photoURL,
  });
  setFormValue('');
   bottom.current.scrollIntoView({ behavior: "smooth" });

  
}
  return (
    <>
      <main>
        <div>
          {messages &&
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
            <div ref={bottom}> </div>
        </div>
      </main>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => {
            setFormValue(e.target.value);
           
          }}
        />
        <button type="submit"> submit</button>
      </form>
    </>
  ); 
};


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  </>)
}


function App() {

  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <header>
          <h1>🔥💬 Chat Online 10101</h1>
          <SignOut />
        </header>
      </header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

export default App;
