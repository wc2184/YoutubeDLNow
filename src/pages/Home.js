import {
  Box,
  Button,
  Grid,
  Input,
  Spacer,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { db } from '../index';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [text, setText] = useState();
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const toast = useToast();
  const auth = getAuth();
  console.log(auth.currentUser ? auth.currentUser.displayName : null);
  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        //signed in success
        console.log(user.displayName);
        //   setTimeout(() => {
        setUser(user.displayName);
        //   }, 300);
      } else {
        console.log('NOBODY');
        //   setUser('');
        // signed out success
        //   setTimeout(() => {
        // setUser('');
        //   }, 300);
        setTimeout(() => {
          navigate('/auth');
        }, 500);
      }
    });
  }, [auth, user]);

  if (user === undefined)
    return (
      <div style={{ textAlign: 'center', marginTop: '30vh' }}>
        <Spinner
          size="xl"
          color="red.500"
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
        />
      </div>
    );
  async function paste(input) {
    const text = await navigator.clipboard.readText();
    await setText(text);
    addLink(text);
  }
  //firebase
  const addLink = async word => {
    console.log(text, 'text');
    console.log(auth.currentUser.email, 'auth');
    try {
      const docRef = await addDoc(collection(db, 'songs'), {
        link: text || word,
        time: serverTimestamp(),
        user: auth.currentUser.email,
        // user: auth.user.toString(),
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const userData = () => {
    const q = query(
      collection(db, 'songs'),
      where('user', '==', auth.currentUser.email)
    );
    const q2 = query(collection(db, 'songs'));
    getDocs(q).then(data => {
      data.forEach(doc => {
        console.log(doc.data());
      });
    });
  };

  return (
    <Box
      margin={{ base: '10vw 5vw 0vw 5vw', md: '10vw 20vw 0vw 20vw' }}
      //   style={{ marginLeft: '20vw', marginRight: '20vw', marginTop: '10vh' }}
    >
      <Box w="100%" display="flex" justifyContent="space-between">
        <Input
          style={{ marginRight: '10px' }}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter your youtube URL link here"
        />
        <Button
          onClick={async () => {
            if (!(text == undefined || text == '')) {
              console.log(text);
              await addLink();
              toast({
                title: 'Added the Youtube link to your account.',
                description: 'It is now available on your phone.',
                status: 'success',
                position: 'top',
                duration: 2500,
                isClosable: true,
              });
              setText('');
            }
          }}
          colorScheme="teal"
          variant="solid"
        >
          Add
        </Button>
      </Box>
      <Button
        style={{ display: 'block', marginTop: '20px', marginLeft: 'auto' }}
        onClick={async () => {
          console.log(db);
          paste();
          setTimeout(() => {
            toast({
              title: 'Pasted and Added to Phone.',
              description:
                "We've pasted the link from your clipboard and it's now available on your phone.",
              status: 'success',
              position: 'top',
              duration: 2500,
              isClosable: true,
            });
            setText('');
          }, 500);
        }}
        colorScheme="teal"
        variant="outline"
      >
        Paste and Add
      </Button>
      <Button onClick={userData}>Data</Button>
    </Box>
  );
};
export default Home;
