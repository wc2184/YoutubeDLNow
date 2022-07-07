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
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';

function App() {
  const tabs = ['/home', '/about', '/auth'];
  const [tabIndex, setTabIndex] = useState(
    tabs.indexOf(window.location.pathname)
  );
  let navigate = useNavigate();

  useEffect(() => {
    setTabIndex(tabs.indexOf(window.location.pathname));
  }, [window.location.pathname, tabs]);

  console.log(window.location.pathname);

  const handleTabsChange = index => {
    setTabIndex(index);
  };

  return (
    <Grid display="flex" flexDir="column" minH="100vh" p={3}>
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
            <Tab onClick={() => navigate('/about')}>About</Tab>
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
          <Route
            path="/about"
            element={<div>This page is useless. /home has everything.</div>}
          />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Box>
      {/* two ele end */}
      {/* </Box> */}
    </Grid>
  );
}

export default App;
