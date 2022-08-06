import {
  Box,
  Button,
  Checkbox,
  Grid,
  Image,
  Input,
  Spacer,
  Spinner,
  Switch,
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
import { useEffect, useRef, useState } from 'react';
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
import { CloseIcon, DownloadIcon, SmallCloseIcon } from '@chakra-ui/icons';
import { v4 as uuidv4 } from 'uuid';
import download from 'downloadjs';

const Home = () => {
  const [text, setText] = useState();
  const [user, setUser] = useState();
  const [data, setData] = useState([]);
  const ref = useRef('');
  const [loading, setLoading] = useState(false);
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
    document.body.focus();

    const text = await navigator.clipboard.readText();
    // await setText(text);
    document.body.focus();

    addLink(text);
    document.body.focus();

    console.log('in here');
  }
  //firebase
  const addLink = async word => {
    document.body.focus();

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
  function youtube_parser(url) {
    var regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return match && match[7].length == 11 ? match[7] : false;
  }
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

  const downloade = async (link, type) => {
    // THE ISSUE WAS NAMING THIS FUNCTION DOWNLOAD SOMEHOW NODEJS CALLED IT WITH RESPONDSE.download lol
    setLoading(link);

    console.log(typeof link, 'b4');
    // let newlink = `http://localhost:5000/download?link=` + link;
    let newlink =
      `https://youtubedownloadin.herokuapp.com/download/${type}?link=` + link;
    console.log(newlink, 'mid');
    const res = await fetch(newlink);
    console.log(res.headers.forEach(console.log), 'headers');
    console.log(res.headers.get('content-disposition'));
    console.log(res, 'response');
    toast({
      title: 'We are generating your file.',
      description: `Your video is downloading. Please wait one moment.`,
      // description: `Your video ${
      //   res.headers.get('content-disposition').split('"')[1]
      // } is downloading. Please wait one moment.`,
      status: 'info',
      duration: 4000,
      isClosable: true,
    });

    const blob = await res.blob();
    console.log(blob);
    download(blob, res.headers.get('content-disposition').split('"')[1]);
    // download(blob);
    setLoading(false);
    toast({
      title: 'Congratulations.',
      description: `Your video has been downloaded successfully!.`,
      // description: `Your video ${
      //   res.headers.get('content-disposition').split('"')[1]
      // } has been downloaded successfully!.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    console.log(link, 'after');
    // if (link == undefined || link == "") return;
    // window.open(
    //   `https://youtubedownloadin.herokuapp.com/download?link=${link}`,
    //   "_blank"
    // );
    // `https://youtubedownloadin.herokuapp.com/download?link=https://www.youtube.com/watch?v=iRH9Y97vQ48`
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
          document.body.focus();
          paste();
          document.body.focus();

          setTimeout(() => {
            document.body.focus();

            toast({
              title: 'Pasted and Added to Phone.',
              description:
                "We've pasted the link from your clipboard and it's now available on your phone.",
              status: 'success',
              position: 'top',
              duration: 2500,
              isClosable: true,
            });
            document.body.focus();

            setText('');
            document.body.focus();
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
          <TableCaption>
            Enjoy a self-curated intentional and mindful youtube experience.
          </TableCaption>
          <TableCaption>
            Download videos to watch instead of letting the algorithm dictate
            your life.
          </TableCaption>
          <Thead>
            <Tr display="flex">
              <Th flex="1">Youtube entries</Th>
            </Tr>
          </Thead>{' '}
          <Tbody>
            {data.map(data => (
              <div key={data[3]}>
                <Tr display="flex">
                  <img
                    fit
                    style={{
                      marginRight: '0',
                      marginRight: '0',
                      marginBottom: '5px',
                      marginTop: '5px',
                    }}
                    height="97.5px"
                    width="120px"
                    src={`https://img.youtube.com/vi/${youtube_parser(
                      data[2]
                    )}/0.jpg
                      `}
                    alt="Youtube Link"
                  />

                  <Td flex="1">
                    <div
                      style={{
                        marginTop: '10px',
                        maxHeight: '10vh',
                        width: '15vw',
                        wordBreak: 'break-all',
                        whiteSpace: 'normal',
                        wordWrap: 'normal',
                      }}
                    >
                      {data[0]}
                    </div>
                    <Button
                      onClick={() => {
                        downloade(data[2], 'audio');
                      }}
                      style={{ marginTop: '7px' }}
                      colorScheme="teal"
                      size="xs"
                      isLoading={loading == data[2]}
                    >
                      Audio Download
                    </Button>
                  </Td>
                  <Td
                    style={{
                      display: 'flex',
                      paddingTop: '4px',
                      width: '15vw',
                    }}
                    flex="1"
                  >
                    <Button
                      style={{
                        display: 'block',
                        padding: '8px',
                        minWidth: '7vw',
                      }}
                      my="auto"
                      leftIcon={<DownloadIcon />}
                      link={data[2]}
                      colorScheme="green"
                      isLoading={loading == data[2]}
                      // loadingText="Wait..."
                      onClick={() => {
                        console.log('clicked download');
                        // downloade(
                        //   'https://www.youtube.com/watch?v=lTxn2BuqyzU'
                        // );
                        downloade(data[2], 'video');
                      }}
                    >
                      Download
                    </Button>
                    <Button
                      my="auto"
                      style={{ marginLeft: '20px' }}
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
                    {data[1]
                      ? data[1].toDate().toISOString().split('T')[0]
                      : null}
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
