import React, { useState } from "react";
import { View, TouchableOpacity, Image, StyleSheet, Text } from "react-native";
import { GiftedChat, Bubble, InputToolbar, Send } from "react-native-gifted-chat";
import { Ionicons } from "@expo/vector-icons";

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    {
      _id: 1,
      text: "It’ll get 25 minutes to arrive to your address",
      createdAt: new Date(),
      user: { _id: 2, name: "Support", avatar: require("../../assets/image_customer/supporter.jpg") },
    },
    {
      _id: 2,
      text: "Sure...",
      createdAt: new Date(),
      user: { _id: 1, name: "User", avatar: require("../../assets/image_customer/Chi.png") },
    },
    {
      _id: 3,
      text: "Ok, please let me check!",
      createdAt: new Date(),
      user: { _id: 2, name: "Support", avatar: require("../../assets/image_customer/supporter.jpg") },
    },
    {
      _id: 4,
      text: "Hello, I ordered two fried chicken burgers. Can I know how much time it will take to arrive?",
      createdAt: new Date(),
      user: { _id: 1, name: "User", avatar: require("../../assets/image_customer/Chi.png") },
    },
    {
      _id: 5,
      text: "Hi, how can I help you?",
      createdAt: new Date(),
      user: { _id: 2, name: "Support", avatar: require("../../assets/image_customer/supporter.jpg") },
    },
  ]);

  const onSend = (newMessages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Chat Body */}
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{ _id: 1 }}
        alwaysShowSend
        scrollToBottom
        renderAvatarOnTop={false}
        renderAvatar={(props) => 
          props.currentMessage.user.avatar ? (
            <Image 
              source={props.currentMessage.user.avatar} 
              style={[styles.avatar, props.position === 'left' ? styles.avatarLeft : styles.avatarRight]} 
            />
          ) : null
        }
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              right: styles.userBubble,
              left: styles.supportBubble,
            }}
            textStyle={{
              right: styles.userText,
              left: styles.supportText,
            }}
          />
        )}
        renderSend={(props) => (
          <Send {...props}>
            <View style={styles.sendButton}>
              <Ionicons name="paper-plane" size={24} color="#A88FFF" />
            </View>
          </Send>
        )}
        renderInputToolbar={(props) => (
          <InputToolbar {...props} containerStyle={styles.inputToolbar} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
    elevation: 5,
    justifyContent: "space-between",
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
  avatarLeft: {
    marginLeft: 5,
  },
  avatarRight: {
    marginRight: 5,
    alignSelf: "flex-end",
  },
  userBubble: {
    backgroundColor: "#A88FFF",
    borderRadius: 10,
    padding: 10,
    maxWidth: "75%",
  },
  supportBubble: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    maxWidth: "75%",
  },
  userText: {
    color: "#FFF",
  },
  supportText: {
    color: "#333",
  },
  sendButton: {
    marginRight: 10,
    marginBottom: 10,
  },
  inputToolbar: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    paddingHorizontal: 10,
  },
});

export default ChatScreen;
