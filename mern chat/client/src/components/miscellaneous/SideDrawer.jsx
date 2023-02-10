import {
  Avatar,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
  useDisclosure,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/layout";
import axios from "axios";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { redirect } from "react-router";
import UserListItem from "../userAvatar/UserListItem";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { user, chats, setChats, setSelectedChat } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSearch = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:5000/api/v1/user?search=${search}`,
        config
      );
      setSearchResult(data);
      // console.log(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const accessChat = async (userId) => {
    // console.log(userId);
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5000/api/v1/chat`,
        { userId },
        config
      );
      console.log(data);
      console.log(chats);
      console.log("11");
      // if (!chats.find((c) => c._id === data._id))
      setChats([data, ...chats]);
      console.log(chats);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (err) {}
  };
  //   console.log(user);
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    redirect("/");
  };

  useEffect(() => {
    handleSearch();
  }, [search]);

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        {/* <Tooltip label="Search User to Chat" hasArrow placement="bottem-end"> */}
        <Button variant="ghost" onClick={onOpen}>
          search
        </Button>
        {/* </Tooltip> */}
        <Text fontSize="2xl" fontFamily="Work Sans">
          Tak-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon />
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.user.name}
                src={user.user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);

                  // console.log(search);
                }}
              />
              {/* <Button onChange={() => handleSearch}>Go</Button> */}
            </Box>
            {loading ? (
              <span>loading...</span>
            ) : (
              searchResult.map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                );
              })
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
