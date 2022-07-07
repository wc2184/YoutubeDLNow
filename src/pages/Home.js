import {
  Box,
  Button,
  Grid,
  Input,
  Spacer,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
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
  onSnapshot,
  orderBy,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { CloseIcon, SmallCloseIcon } from '@chakra-ui/icons';
import { v4 as uuidv4 } from 'uuid';

const Home = () => {
  const [text, setText] = useState();
  const [user, setUser] = useState();
  const [data, setData] = useState([]);
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

  useEffect(() => {
    if (user === undefined) return;
    let tempdata = [];
    console.log('hello');
    let q = query(
      collection(db, 'songs'),
      where('user', '==', auth.currentUser.email),
      orderBy('time', 'desc')
    );
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const eles = [];
      //   console.log(querySnapshot);
      //   for (const doc of querySnapshot) {
      //     console.log(doc, 'is a doc');

      //     eles.push([doc.data().link, doc.data().time]);
      //   }
      //   setData(eles);

      querySnapshot.forEach(doc => {
        console.log(doc, 'is a doc');

        eles.push([
          doc.data().link,
          doc.data().time,
          doc.data().url,
          doc.data().key,
        ]);
      });
      console.log('Current cities in CA: ', eles.join(', '));
      setData(eles);
      //   tempdata = eles;
      //   console.log(eles);
      //   let newarr = [];
      //   eles.forEach(async array => {
      //     // let link = 'https://www.youtube.com/watch?v=2v3R2c1fG9c';
      //     console.log(array);
      //     let link = array[0];
      //     console.log(link, 'link here');
      //     let newlink = `https://noembed.com/embed?url=${link}`;
      //     let title = "didn't";
      //     await fetch(newlink)
      //       .then(res => res.json())
      //       .then(data => {
      //         console.log(data.title);
      //         if (data.error) title = 'None';
      //         else title = data.title;
      //       });
      //     // newarr.push([array[0]]);
      //     newarr.push([title, array[1]]);
      //     console.log(newarr, 'newarr updated');
      //     setData(newarr);
      //   });
    });
    return () => {
      unsubscribe();
    };
  }, [user]);

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
    console.log('in here');
  }
  //firebase
  const addLink = async word => {
    console.log(text, 'text');
    console.log(auth.currentUser.email, 'auth');
    console.log(word, 'is there word?');
    let dalink = word ? word : text;
    console.log(dalink, 'test');
    let newlink = `https://noembed.com/embed?url=${dalink}`;
    console.log(newlink, 'new link');
    let title = "didn't";
    await fetch(newlink)
      .then(res => res.json())
      .then(data => {
        console.log(data.title);
        if (data.error) title = 'Not a valid Youtube video.';
        else title = data.title;
      });
    try {
      const docRef = await addDoc(collection(db, 'songs'), {
        link: title,
        url: text || word,
        key: uuidv4(),
        // link: text || word,

        time: serverTimestamp(),
        user: auth.currentUser.email,
        // user: auth.user.toString(),
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };
  const deleteLink = async key => {
    const q = query(collection(db, 'songs'), where('key', '==', key));
    const deletingDoc = await getDocs(q);
    console.log(deletingDoc, 'found?');
    deletingDoc.forEach(async ele => {
      //   deleteDoc(doc);
      console.log(ele.id);
      await deleteDoc(doc(db, 'songs', ele.id));

      console.log('deleted');
    });
  };

  const enter = async () => {
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
  };
  //   const getTitle = link => {
  //     let newlink = `https://noembed.com/embed?url=${link}`;
  //     let title = "didn't";

  //     fetch(newlink)
  //       .then(res => res.json())
  //       .then(data => {
  //         console.log(data.title);
  //         title = data.title;
  //       });
  //     return title;
  //   };
  //   getTitle('https://www.youtube.com/watch?v=cxxnuofREcM');

  console.log(data);
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
          onKeyUp={e => {
            if (e.key == 'Enter') {
              enter();
            }
          }}
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
      {/* <Button onClick={userData}>Data</Button> */}
      {/* {JSON.stringify(data)} */}
      <TableContainer>
        <Table size="sm" variant="simple">
          <TableCaption>Imperial to metric conversion factors</TableCaption>
          <Thead>
            <Tr display="flex">
              <Th flex="1">Youtube entries</Th>
            </Tr>
          </Thead>{' '}
          <Tbody>
            {data.map(data => (
              <div key={data[3]}>
                <Tr display="flex">
                  <Td flex="1">
                    <div
                      style={{
                        marginTop: '10px',
                        maxHeight: '10vh',
                        width: '30vw',
                        wordBreak: 'break-all',
                        whiteSpace: 'normal',
                        wordWrap: 'normal',
                      }}
                    >
                      {data[0]}
                    </div>
                  </Td>
                  <Td style={{ paddingTop: '4px' }} flex="1">
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(data[2]);
                        toast({
                          title: 'Copied to clipboard',

                          status: 'success',
                          position: 'top',
                          duration: 800,
                        });
                      }}
                    >
                      Copy Link
                    </Button>
                    {/* <div
                      style={{
                        width: '2vw',
                        wordWrap: 'break-word',
                        overflow: 'auto',
                      }}
                    >
                      {data[2]}
                    </div> */}
                  </Td>
                  {/* fetch the title of the youtube video */}
                  <Td style={{ marginTop: '10px' }}>
                    {data[1] ? data[1].toDate().toLocaleString() : null}
                  </Td>
                  <Td>
                    <Button
                      //   style={{ padding: '3px' }}
                      size="sm"
                      colorScheme="red"
                      variant="outline"
                      color="red"
                      // find the element with key of X and firestore delete
                      onClick={() => {
                        deleteLink(data[3]);
                      }}
                    >
                      <CloseIcon />
                    </Button>
                  </Td>
                </Tr>
              </div>
            ))}{' '}
          </Tbody>
        </Table>
      </TableContainer>
      {/* {
        <Tbody>
          <Tr>
            <Td>inches</Td>
            <Td>millimetres (mm)</Td>
            <Td isNumeric>25.4</Td>
          </Tr>
          <Tr>
            <Td>feet</Td>
            <Td>centimetres (cm)</Td>
            <Td isNumeric>30.48</Td>
          </Tr>
        </Tbody>
      } */}
    </Box>
  );
};
export default Home;
