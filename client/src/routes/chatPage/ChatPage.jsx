
import "./chatPage.css"
import NewPrompt from "../../components/newPrompt/NewPrompt"
import Markdown from "react-markdown"
import { useLocation } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { IKImage } from "imagekitio-react"


const ChatPage = () => {

    const path = useLocation().pathname
    const chatId = path.split("/").pop()
    const { isPending, error, data } = useQuery({
        queryKey: ['chat', chatId],
        queryFn: () =>
          fetch(`http://localhost:3000/api/chats/${chatId}`,{
            credentials: "include",
          }).then((res) =>
            res.json()
          ),
      })

    return (
        <div className= "chatPage">
            <div className="wrapper">
                <div className="chat">
                   
                   { isPending ? "Loading ... " : error ? "Something went wrong" : data?.history?.map((message,i) =>(
                    <>
                    {message.img && (
                       <IKImage
                       urlEndpoint = "https://ik.imagekit.io/f7oddq0fs"
                       path ={message.img}
                       height ="300"
                       width = "400"
                       transformation = {[{height:300,width: 400}]}
                       loading = "lazy"
                       lgip={{active:true,quality:20}}

                       />
                    )}
                    <div className={message.role === "user" ? "message user" : "message"} key = {i}>
                        <Markdown>{message.parts[0].text}</Markdown>
                    </div>
                    </>
                   ))}
                   
                   {data && <NewPrompt data={data}/>}
                   
                </div>
            </div>
        </div>
    )
}

export default ChatPage