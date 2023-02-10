import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../context/ChatProvider";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  return (
    <div>
      {selectedChat ? (
        <></>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click to start chatting
          </Text>
        </Box>
      )}
    </div>
  );
};

export default SingleChat;
