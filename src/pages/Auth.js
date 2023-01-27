import { Box, Button, useToast } from '@chakra-ui/react';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { provider } from '../index';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@chakra-ui/react';

const Auth = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [user, setUser] = useState();
  const auth = getAuth();
  console.log(auth);
  console.log(user, 'USER');
  onAuthStateChanged(auth, user => {
    if (user) {
      //signed in success
      console.log(user.displayName);
      setTimeout(() => {
        setUser(user.displayName);
      }, 300);
    } else {
      // signed out success
      setTimeout(() => {
        setUser('');
      }, 300);
    }
  });
  const login = () => {
    signInWithPopup(auth, provider)
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        toast({
          title: 'Logged in. Automatically redirecting in 2 seconds...',
          description: 'You are now signed in. ',
          status: 'success',
          duration: 1600,
          isClosable: true,
        });
        setTimeout(() => {
          navigate('/home');
        }, 2000);

        // ...
      })
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };
  const signout = () => {
    signOut(auth).then(() => {
      toast({
        title: 'Signed out.',
        description: 'You are now signed out.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    });
  };
  // for a split second the user is not defined, we use onauthstatechange to set no user => empty string instead of undefined, so this is good
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

  return (
    <Box
      flex="1 0 80%"
      style={{ marginLeft: '20vw', marginRight: '20vw', marginTop: '20vh' }}
    >
      <div style={{ textAlign: 'center' }}>
        {' '}
        <div>{user ? user + ' is signed in.' : 'Please sign in first.'}</div>
        {!user ? (
          <Button
            style={{ marginTop: '5vh', marginBottom: '5vh' }}
            onClick={login}
            leftIcon={<ExternalLinkIcon />}
            colorScheme="teal"
            variant="solid"
            size="lg"
          >
            Google Sign In
          </Button>
        ) : (
          <Button
            style={{ marginTop: '5vh', marginBottom: '5vh' }}
            onClick={signout}
            leftIcon={<ExternalLinkIcon />}
            colorScheme="red"
            variant="solid"
            size="lg"
          >
            Sign Out
          </Button>
        )}
      </div>
    </Box>
  );
};
export default Auth;
