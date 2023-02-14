import React, { useEffect, useState } from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Divider,
  useDisclosure,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import About from './pages/About';

function App() {
  const tabs = ['/home', '/about', '/auth'];
  const [tabIndex, setTabIndex] = useState(
    tabs.indexOf(window.location.pathname)
  );
  let navigate = useNavigate();

  useEffect(() => {
    setTabIndex(tabs.indexOf(window.location.pathname));
    if (window.location.pathname == '/') navigate('/home');
  }, [window.location.pathname, tabs]);

  const handleTabsChange = index => {
    setTabIndex(index);
  };
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Grid
      className="scrollContainer"
      display="flex"
      flexDir="column"
      minH="100vh"
      p={3}
    >
      {/* <Box textAlign="center" fontSize="xl"> */}
      {/* MUST USE DISPLAY FLEX U RETARD */} {/* one ele start */}
      {/* PREVENT THIS NAVBAR FROM GROWING with flex 0  */}
      <Box flex="0 1 20%" height="100%">
        <Box pos="absolute" right="25px">
          <ColorModeSwitcher />
        </Box>
        <Tabs
          index={tabIndex}
          onChange={handleTabsChange}
          variant="soft-rounded"
          colorScheme="green"
          align="center"
        >
          <TabList>
            <Tab onClick={() => navigate('/home')}>Home</Tab>
            <Tab
              onClick={() => {
                // navigate('/about');
                onOpen();
              }}
            >
              About Me
            </Tab>
            <Tab onClick={() => navigate('/auth')}>Auth</Tab>
          </TabList>
          {/* <TabPanels>
            <TabPanel>
              <p>Youtube Link Adder</p>
            </TabPanel>
            <TabPanel>
              <p>About</p>
            </TabPanel>
            <TabPanel>
              <p>Auth</p>
            </TabPanel>
          </TabPanels> */}
        </Tabs>
        <Divider style={{ marginTop: '5vh' }} />
      </Box>
      {/* one ele end */}
      {/* two ele start */}
      <Box flex="1 0 80%">
        <Routes>
          <Route path="/home" element={<Home />} />
          {/* <Route
            path="/about"
            element={<About isOpen={isOpen} onClose={onClose} />}
          /> */}
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Box>
      <About isOpen={isOpen} onClose={onClose} />
      {/* two ele end */}
      {/* </Box> */}
    </Grid>
  );
}

export default App;
