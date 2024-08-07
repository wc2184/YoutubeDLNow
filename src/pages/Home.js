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
import { Link, useNavigate } from 'react-router-dom';
import { CloseIcon, DownloadIcon, SmallCloseIcon } from '@chakra-ui/icons';
import { v4 as uuidv4 } from 'uuid';
import download from 'downloadjs';

const Home = () => {
  const [text, setText] = useState();
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const ref = useRef('');
  const [loading, setLoading] = useState(false);
  const [warningSent, setWarningSent] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        //signed in success

        //   setTimeout(() => {
        setUser(user.displayName);
        //   }, 300);
      } else {
        //   setUser('');
        // signed out success
        //   setTimeout(() => {
        // setUser('');
        //   }, 300);
        //
        // LOGIN
        // setTimeout(() => {
        //   navigate('/auth');
        // }, 500);
        // toast({
        //   title: 'You can use this site, but you are not logged in.',
        //   description:
        //     'Any video links added will be shared with everyone who uses this site.',
        //   status: 'warning',
        //   position: 'bottom',
        //   duration: 7500,
        //   isClosable: true,
        // });
      }
    });
  }, [auth, user]);

  useEffect(() => {
    if (user === undefined) return;
    let anon = null;

    if (user == null) {
      anon = 'public';
    }
    let tempdata = [];

    let q = query(
      collection(db, 'songs'),
      where('user', '==', anon || auth.currentUser.email),
      orderBy('time', 'desc')
    );
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const eles = [];
      //
      //   for (const doc of querySnapshot) {
      //

      //     eles.push([doc.data().link, doc.data().time]);
      //   }
      //   setData(eles);

      querySnapshot.forEach(doc => {
        eles.push([
          doc.data().link,
          doc.data().time,
          doc.data().url,
          doc.data().key,
        ]);
      });

      setData(eles);
      //   tempdata = eles;
      //
      //   let newarr = [];
      //   eles.forEach(async array => {
      //     // let link = 'https://www.youtube.com/watch?v=2v3R2c1fG9c';
      //
      //     let link = array[0];
      //
      //     let newlink = `https://noembed.com/embed?url=${link}`;
      //     let title = "didn't";
      //     await fetch(newlink)
      //       .then(res => res.json())
      //       .then(data => {
      //
      //         if (data.error) title = 'None';
      //         else title = data.title;
      //       });
      //     // newarr.push([array[0]]);
      //     newarr.push([title, array[1]]);
      //
      //     setData(newarr);
      //   });
    });
    return () => {
      unsubscribe();
    };
  }, [user]);

  // if (user === undefined)
  //   return (
  //     <div style={{ textAlign: 'center', marginTop: '30vh' }}>
  //       <Spinner
  //         size="xl"
  //         color="red.500"
  //         thickness="4px"
  //         speed="0.65s"
  //         emptyColor="gray.200"
  //       />
  //     </div>
  //   );

  async function paste(input) {
    document.body.focus();

    const text = await navigator.clipboard.readText();
    // await setText(text);
    document.body.focus();

    addLink(text);
    document.body.focus();
  }
  //firebase
  const addLink = async word => {
    document.body.focus();
    let anon = null;
    if (user == null) {
      anon = 'public';
      if (!warningSent)
        toast({
          title: 'You can use this site, but you are not logged in.',
          description:
            'Any video links added will be shared with everyone who uses this site.',
          status: 'warning',
          position: 'bottom',
          duration: 4000,
          isClosable: true,
        });
      setWarningSent(true);
    }

    let dalink = word ? word : text;

    let newlink = `https://noembed.com/embed?url=${dalink}`;

    let title = "didn't";
    await fetch(newlink)
      .then(res => res.json())
      .then(data => {
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
        user: anon || auth.currentUser.email,
        // user: auth.user.toString(),
      });
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

    deletingDoc.forEach(async ele => {
      //   deleteDoc(doc);

      await deleteDoc(doc(db, 'songs', ele.id));
    });
  };

  const enter = async () => {
    if (!(text == undefined || text == '')) {
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
  //
  //         title = data.title;
  //       });
  //     return title;
  //   };
  //   getTitle('https://www.youtube.com/watch?v=cxxnuofREcM');

  const downloade = async (link, type) => {
    // THE ISSUE WAS NAMING THIS FUNCTION DOWNLOAD SOMEHOW NODEJS CALLED IT WITH RESPONDSE.download lol
    setLoading(link);

    // let newlink = `http://localhost:5000/download?link=` + link;
    let newlink =
      `https://youtubedownloadin.herokuapp.com/download/${type}?link=` + link;

    if (type == 'audio') {
      toast({
        title: 'We are converting your audio file.',
        description: `Please wait a moment, audio tracks take a tad longer to convert.`,
        // description: `Your video ${
        //   res.headers.get('content-disposition').split('"')[1]
        // } is downloading. Please wait one moment.`,
        status: 'info',
        duration: 11000,
        isClosable: true,
      });
    }
    const res = await fetch(newlink);

    toast({
      title: 'We are generating your file.',
      description: `Your ${type} is downloading. Please wait one moment.`,
      // description: `Your video ${
      //   res.headers.get('content-disposition').split('"')[1]
      // } is downloading. Please wait one moment.`,
      status: 'info',
      duration: 4000,
      isClosable: true,
    });

    const blob = await res.blob();

    download(blob, res.headers.get('content-disposition').split('"')[1]);
    // download(blob);
    setLoading(false);
    toast({
      title: 'Congratulations.',
      description: `Your ${type} has been downloaded successfully!.`,
      // description: `Your video ${
      //   res.headers.get('content-disposition').split('"')[1]
      // } has been downloaded successfully!.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });

    // if (link == undefined || link == "") return;
    // window.open(
    //   `https://youtubedownloadin.herokuapp.com/download?link=${link}`,
    //   "_blank"
    // );
    // `https://youtubedownloadin.herokuapp.com/download?link=https://www.youtube.com/watch?v=iRH9Y97vQ48`
  };

  return (
    <Box
      margin={{ base: '1vw 5vw 0vw 5vw', md: '1vw 20vw 0vw 20vw' }}
      //   style={{ marginLeft: '20vw', marginRight: '20vw', marginTop: '10vh' }}
    >
      {' '}
      <a
        style={{ display: 'block', width: '60%', margin: 'auto' }}
        href="https://github.com/wc2184/YoutubeDLNow"
        target="_blank"
      >
        <Image
          mb={10}
          width="100%"
          src="https://res.cloudinary.com/dkg7lxnj2/image/upload/v1676116464/YoutubeDLNow_kvtefz.png"
        ></Image>
      </a>
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
              await addLink();
              toast({
                title: 'Added the Youtube link to your account.',
                description: 'It is now stored to your account.',
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
          document.body.focus();
          paste();
          document.body.focus();

          setTimeout(() => {
            document.body.focus();

            toast({
              title: 'Pasted and Added to Account.',
              description:
                "We've pasted the link from your clipboard and it's now available on your account.",
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
                        minWidth: '8vw',
                      }}
                      my="auto"
                      leftIcon={<DownloadIcon />}
                      link={data[2]}
                      colorScheme="green"
                      isLoading={loading == data[2]}
                      // loadingText="Wait..."
                      onClick={() => {
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
