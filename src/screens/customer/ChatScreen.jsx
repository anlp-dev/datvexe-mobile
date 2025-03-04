import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    { id: "1", text: "Hi, how can I help you?", user: "support" },
    { id: "2", text: "Hello, I ordered two fried chicken burgers. Can I know how much time it will take to arrive?", user: "user" },
    { id: "3", text: "Ok, please let me check!", user: "support" },
    { id: "4", text: "Sure...", user: "user" },
    
  ]);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef(null);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = { id: Date.now().toString(), text: inputText, user: "user" };
      setMessages([...messages, newMessage]);
      setInputText("");
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageWrapper, item.user === "user" ? styles.userWrapper : styles.supportWrapper]}>
      {item.user === "support" && <Image source={require("../../assets/image_customer/supporter.jpg")} style={styles.avatar} />}
      <View style={[styles.messageContainer, item.user === "user" ? styles.userMessage : styles.supportMessage]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
      {item.user === "user" && <Image source={require("../../assets/image_customer/Chi.png")} style={styles.avatar} />}
    </View>
  );

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

      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Input Field */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="paper-plane" size={24} color="#A88FFF" />
        </TouchableOpacity>
      </View>
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
  chatContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
  },
  messageWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  userWrapper: {
    justifyContent: "flex-end",
  },
  supportWrapper: {
    justifyContent: "flex-start",
  },
  messageContainer: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 10,
  },
  userMessage: {
    backgroundColor: "#A88FFF",
    alignSelf: "flex-end",
  },
  supportMessage: {
    backgroundColor: "#FFF",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
  },
  sendButton: {
    marginLeft: 10,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginHorizontal: 5,
  },
});

export default ChatScreen;
