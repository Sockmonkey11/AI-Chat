import "./newPrompt.css"
import { useEffect,useRef} from "react"
import Upload from "../upload/Upload"
import { IKImage } from "imagekitio-react"
import { useState } from "react"
import model from "../../lib/gemini"
import Markdown from "react-markdown"
import { useQueryClient } from "@tanstack/react-query"
import { useMutation } from "@tanstack/react-query"
import { useLayoutEffect } from "react"


const NewPrompt = ({data}) => {

const [question,setQuestion]= useState("")
const [answer,setAnswer]=useState("")
  const [img,setImg]= useState({
    isLoading:false,
    error:"",
    dbData:{},
    aiData:{},
  })

  const chat = model.startChat({
    history: [
     data?.history.map(({role,parts})=>(
      {role, parts: [{text: parts[0].text}]}
     ))
    ],
    generationConfig: {

    }
  });

    const endRef=useRef(null)
    const formRef=useRef(null)

    useEffect(()=>{
        endRef.current.scrollIntoView({behavior:"smooth"})
    },[data, question,answer, img.dbData])


    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: () =>{
            return fetch(`https://hellohiAi.com/api/chats/${data._id}`, {
                method:"PUT",
                credentials: "include",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({question: question.length ? question : undefined,
                  answer,
                  img: img.dbData?.filePath || undefined,
                }),
            }).then((res)=>res.json())
        },
        onSuccess: () => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: ['chat',data._id] }).then(()=>{
            formRef.current.reset()
            setQuestion("")
            setAnswer("")
            setImg({
              isLoading:false,
              error:"",
              dbData:{},
              aiData:{},
            })
          })
        },
        onError:(err)=>{
          console.log(err)
        }
      })

    const add = async (text, isInitial)=> {
        if (!isInitial)setQuestion(text)
        try{
        const result = await chat.sendMessageStream(Object.entries(img.aiData).length ? [img.aiData,text] : [text]);
        
    let accumulatedText = "";
    for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    
        accumulatedText += chunkText;
        console.log(chunkText)
        setAnswer(accumulatedText);
    

    }
    mutation.mutate();
    
  }
    catch(err){
      console.log(err)
    }
  }
       
        

   const handleSubmit = async (e) => {
  e.preventDefault();
  const text = e.target.text.value;
  if (!text) return;
  await add(text, false);
}

//IN PRODUCTION WE DONT NEED IT
const hasRun = useRef(false)

    useEffect(()=>{
      if(!hasRun.current){
      if (data?.history?.length === .5){
        add(data.history[0].parts[0].text, true)
      }
    }
    hasRun.current=true;
    },[])
    return (
        <>
            {/* //ADD NEW CHAT */}
            {img.isLoading && <div className="">Loading...</div>}
            {img.dbData?.filePath && (
                <IKImage
                urlEndpoint="https://ik.imagekit.io/f7oddq0fs"
                path={img.dbData?.filePath}
                width="380"
                transformation={[{ width:380}]}
                />
            )}
            {question && <div className = "message user">{question}</div>}
            {answer && (<div className = "message"><Markdown>{answer}</Markdown></div>)}

         <div className="endChat" ref={endRef}></div>
            <form className="newForm" onSubmit={handleSubmit} ref ={formRef} >
                <Upload setImg= {setImg}/>
                <input id ="file" type="file" multiple={false} hidden/>
                <input type="text" name ="text"placeholder="Ask my anything!!"/>
                <button>
                    <img src="/arrow.png" alt="" />
                </button>
            </form>
        </>
    )

  }
export default NewPrompt