import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const ChatApp = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  async function generateAnswer(e) {
    e.preventDefault();
    if (!question.trim()) return;

    setGeneratingAnswer(true);
    const currentQuestion = question;
    setQuestion(""); // Clear input immediately after sending

    // Add user question to chat history
    setChatHistory((prev) => [
      ...prev,
      { type: "question", content: currentQuestion },
    ]);

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${
          import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
        }`,
        method: "post",
        data: {
          contents: [
            {
              parts: [
                {
                  text: `You are a literature expert and a story book and poem write that writes stories in chapters, provides information about books and helps with meaning of words, chapter writing, poem writing. If the question is unrelated to these topics, respond with "I can only discuss literature-related topics." Here is the question: ${currentQuestion}`,
                },
              ],
            },
          ],
        },
      });

      const aiResponse =
        response["data"]["candidates"][0]["content"]["parts"][0]["text"];

      // Filter out non-literature responses
      if (!isLiteratureRelated(aiResponse)) {
        setChatHistory((prev) => [
          ...prev,
          {
            type: "answer",
            content: "I can only discuss literature-related topics.",
          },
        ]);
        setAnswer("I can only discuss literature-related topics.");
      } else {
        setChatHistory((prev) => [
          ...prev,
          { type: "answer", content: aiResponse },
        ]);
        setAnswer(aiResponse);
      }
    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    }
    setGeneratingAnswer(false);
  }

  // Function to filter literature-related responses
  function isLiteratureRelated(text) {
    const keywords = [
      "novel",
      "story",
      "plot",
      "character",
      "literature",
      "writing",
      "author",
      "poetry",
      "fiction",
      "prose",
      "narrative",
      "literary",
      "book",
      "manuscript",
      "publishing",
      "genre",
      "dialogue",
      "theme",
      "book",
      "chapter",
    ];
    return keywords.some((keyword) => text.toLowerCase().includes(keyword));
  }

  return (
    <div className="bg-white">
      <div className="h-full max-w-4xl mx-auto flex flex-col p-3">
        {/* Fixed Header */}
        <header className="text-center py-4">
          <h1 className="text-4xl font-bold text-brown-600 hover:text-brown-700 transition-colors">
            NovelChat
          </h1>
        </header>

        {/* Scrollable Chat Container */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto min-h-[300px] max-h-[500px] mb-4 rounded-lg bg-[#E1CDBB] shadow-lg p-4 scrollbar-thin scrollbar-thumb-brown-700 scrollbar-track-brown-300"
          style={{ scrollBehavior: "smooth" }}
        >
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="bg-[#E1CDBB] rounded-xl p-8 max-w-2xl">
                <h2 className="text-2xl font-bold text-brown-700 mb-4">
                  Welcome to NovelChat! 👋
                </h2>
                <p className="text-brown-600 mb-4">
                  I'm here to help you with anything you'd like to know. You can
                  ask me about:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="bg-button p-4 rounded-lg shadow-sm">
                    <span className="text-white">💡 General knowledge </span>
                  </div>
                  <div className="bg-button p-4 rounded-lg shadow-sm">
                    <span className="text-white">🔧 Novel Terminologies</span>
                  </div>
                  <div className="bg-button p-4 rounded-lg shadow-sm">
                    <span className="text-white">📝 Writing assistance</span>
                  </div>
                  <div className="bg-button p-4 rounded-lg shadow-sm">
                    <span className="text-white">
                      🤔 Understanding Novel Concepts
                    </span>
                  </div>
                </div>
                <p className="text-brown-500 mt-6 text-sm">
                  Just type your question below and press Enter or click Send!
                </p>
              </div>
            </div>
          ) : (
            chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  chat.type === "question" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block max-w-[80%] p-3 rounded-lg overflow-auto hide-scrollbar ${
                    chat.type === "question"
                      ? "bg-button text-white rounded-br-none"
                      : "bg-[#E1CDBB] text-brown-800 rounded-bl-none"
                  }`}
                >
                  <ReactMarkdown className="overflow-auto hide-scrollbar">
                    {chat.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))
          )}
          {generatingAnswer && (
            <div className="text-left">
              <div className="inline-block bg-[#E1CDBB] p-3 rounded-lg animate-pulse">
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Fixed Input Form */}
        <form
          onSubmit={generateAnswer}
          className="bg-[#E1CDBB] rounded-lg shadow-lg p-4"
        >
          <div className="flex gap-2">
            <textarea
              required
              className="flex-1 bg-white border border-brown-300 rounded p-3 focus:border-brown-400 focus:ring-1 focus:ring-brown-400 resize-none"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything..."
              rows="2"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  generateAnswer(e);
                }
              }}
            ></textarea>
            <button
              type="submit"
              className={`px-6 py-2 bg-button text-white rounded-md hover:bg-brown-700 transition-colors ${
                generatingAnswer ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={generatingAnswer}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatApp;
