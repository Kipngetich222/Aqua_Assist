const [messages, setMessages] = useState([]);

const handleSend = async (text) => {
  const response = await sendMessageToChatbot(text);
  setMessages([
    ...messages,
    { text, isUser: true },
    { text: response, isUser: false },
  ]);
};
