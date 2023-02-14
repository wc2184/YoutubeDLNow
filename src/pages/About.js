import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import { AiFillGithub } from 'react-icons/ai';
import { AiFillLinkedin } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { RiComputerLine } from 'react-icons/ri';

const About = ({ isOpen, onClose }) => {
  const [isLessThan1372] = useMediaQuery('(max-width: 1372px)');
  const navigate = useNavigate();

  return (
    <>
      <Box w="100%">
        <Modal
          isCentered
          preserveScrollBarGap
          isOpen={isOpen}
          onClose={() => {
            onClose();
            navigate('/home');
          }}
        >
          <ModalOverlay w="100%" h="100%" />
          <ModalContent
            minWidth="50%"
            // width="100%"
            //   minHeight="80%"
          >
            <ModalHeader fontSize="6xl">Hi, I'm William 👋</ModalHeader>
            <ModalCloseButton />
            <ModalBody mb={5} fontSize={isLessThan1372 ? '1.25rem' : '1.5rem'}>
              I created this website, Spotifree. <br></br> <br></br> The entire
              site was built with{' '}
              <span style={{ color: 'teal', fontWeight: 'bold' }}>React</span>{' '}
              and{' '}
              <span style={{ color: '#1da1f2', fontWeight: 'bold' }}>
                <a target="_blank" href="https://chakra-ui.com/">
                  Chakra UI
                </a>
              </span>
              .<br></br> <br></br> The brunt of the work was the backend Node.js
              server I made that fetches the video from ytdl, downloads it, and
              sends it to here. 😅 <br></br> <br></br>
              Link to the backend repo:{' '}
              <a
                target="_blank"
                href="https://github.com/wc2184/YoutubeDLNowBackend/blob/main/index.js"
                style={{ textDecoration: 'underline' }}
              >
                https://github.com/wc2184/YoutubeDLNowBackend
              </a>{' '}
              <br></br>
              <br></br> <br></br>{' '}
              <span style={{ fontWeight: 'bold' }}>
                P.S. As a recent CS college grad, I'm currently looking for
                work, so if you loved this site- feel free to reach out to me!
              </span>
            </ModalBody>
            <Box m="0 40px" maxW="100%" display="flex" gap="30px">
              <Button
                as="a"
                href="https://github.com/wc2184"
                target="_blank"
                _hover={{
                  cursor: 'pointer',
                  transform: 'scale(1.03)',
                }}
                backgroundColor="#0d1117"
                color="white"
                fontSize={isLessThan1372 ? '14px' : '1.15rem'}
                leftIcon={<AiFillGithub />}
                flex={1}
              >
                <Text mt="3px">My Github</Text>
              </Button>
              <Button
                as="a"
                href="https://www.linkedin.com/in/william-chan-3bb674194/"
                target="_blank"
                _hover={{
                  cursor: 'pointer',
                  transform: 'scale(1.03)',
                }}
                colorScheme="linkedin"
                fontSize={isLessThan1372 ? '14px' : '1.15rem'}
                leftIcon={<AiFillLinkedin />}
                flex={1.1}
              >
                <Text mt="3px">My LinkedIn</Text>
              </Button>
              <Button
                as="a"
                href="https://williamchan.surge.sh/"
                target="_blank"
                _hover={{
                  cursor: 'pointer',
                  transform: 'scale(1.03)',
                }}
                colorScheme="yellow"
                fontSize={isLessThan1372 ? '14px' : '1.15rem'}
                leftIcon={<RiComputerLine />}
                flex={1}
              >
                <Text mt="3px">My Website</Text>
              </Button>
            </Box>
            <ModalFooter>
              {/* <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button> */}
              {/* <Button variant="ghost">Secondary Action</Button> */}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};
export default About;
