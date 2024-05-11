import React, {useState, useEffect } from 'react';
import sendButton from './assets/arrow-button.webp';

function MainBox({ lyrics}){
    const [input, setInput] = useState("");
    const openAIKey = import.meta.env.VITE_OPENAI_API_KEY;    
    const [clearingMessages, setClearingMessages] = useState(false);

    const [messages, setMessages] = useState([
        {
            message: "Hello I am your Personal Lyrics Interpreter",
            sender: "ChatGPT"
        }
    ]);

    const handleChange = (event)=>{
        setInput(event.target.value)
    }
    useEffect(() => {
        if (lyrics ) {
          handleLyricsSubmission(lyrics);
          console.log("its happening");
        }
      }, [lyrics]); 
      const clearMessages = () => {
        setClearingMessages(true);
        setTimeout(() => {
          setMessages([]);
          setClearingMessages(false);
        }, 500);
      };
    const handleLyricsSubmission = async (lyrics) => {
        const newMessage = {
          message: lyrics,
          sender: "user"
        };
      
        const newMessages = [...messages, newMessage];
      
        setMessages(newMessages);
      
        await processMessageToChatGPT(newMessages);
      };
    const handleSend = async (event)=>{
        event.preventDefault()
        const newMessage = {
            message: input,
            sender: "user"
        }

        const newMessages = [...messages,newMessage];

        setMessages(newMessages);

        setInput('');

        await processMessageToChatGPT(newMessages);
    }
    

    async function processMessageToChatGPT(chatMessages){
        const API_KEY = openAIKey
        let apiMessages = chatMessages.map((messageObject)=>{
            let role="";
            if(messageObject.sender === "ChatGPT"){
                messageObject.message = messageObject.message.split('\n').join(' ');
                role = "assistant"
            }else{
                role = "user"
            }
            return (
                {role: role, content: messageObject.message}
            )
        });

        const systemMessage = {
            role: "system",
            content: "You are a knowledgeable and insightful lyrics interpreter. Your role is to provide a summary of the overall meaning of the songs presented to you. If the user sends a messages in the romanized foreign language, respond in romanized language that the message was sent in. Additionally, you should provide detailed analyses of song lines that are ambiguous, complex, or have a deep meaning, when doing this, use a separate paragraph or section for each line  that you are analyzing. Your explanations should be clear and easy to understand, helping the user to gain a deeper appreciation of the song's lyrics."
        }

        const apiRequestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
                systemMessage,
                ...apiMessages
            ]
        }

        await fetch("https://api.openai.com/v1/chat/completions",{
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody)
        }).then((response)=>{
            return response.json();
        }).then((data)=>{
            console.log(data.choices[0].message.content);
            setMessages(
                [
                    ...chatMessages,
                    {
                        message: data.choices[0].message.content,
                        sender: "ChatGPT"
                    }
                ]
            )
        })
    }

    return (
        <div className="container1 border-rounded mb-10 py-1 text-center ">
        _____________________________________________________________________________________________________________________________________________________________________________________________________
          <div className="response-area border-rounded py-5 ">
          {messages.map((message, index) => {
    return(
        <div key={index} className={`${message.sender==="ChatGPT" ? 'gpt-message' : 'user-message'} message ${clearingMessages ? 'message-exit' : ''}`}>
        <div className="sender">{message.sender==="ChatGPT" ? "LyricsInterpreterGPT" : "You"}</div>
        <div className="message-content">{message.message}</div>
        </div>             
    );
    })}
          </div>
          <div className="prompt-area">
          <div className='input-wrapper'> 
          <textarea className='textareachat px-3 py-3 text-left border-rounded border-red-200' placeholder="Send a message to LyricsInterpreterGPT..." value={input} onChange={handleChange}/>            
          <button className="submit ml-10 bg-red-500 mb-5" type="submit" onClick={handleSend}>
            <img src={sendButton} />
            </button> 
                               
            </div>
            <button className="clear mr-10 bg-red-500 mb-5" type="submit" onClick={clearMessages}> Clear </button>  
  
            </div>
        </div>
      );
}

export default MainBox;