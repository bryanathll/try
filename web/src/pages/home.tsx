// import { useState, useRef } from "react";

import React from "react"

// type Messages = { role: "system" | "user" | "assistant"; content: string }[];

// export default function Home() {
//   const [messages, setMessages] = useState<Messages>([
//     {
//       role: "system",
//       content: "You are a helpful assistant.",
//     },
//   ]);
//   const formRef = useRef<HTMLFormElement | null>(null);
//   return (
//     <div>
//       <div className="container mx-auto px-12">
//         <div className="prose">
//           {messages?.map((message, index) => (
//             <p key={index}>
//               <em>{message.role}</em>: {message.content}
//             </p>
//           ))}
//         </div>
//         <form
//           ref={formRef}
//           onSubmit={async (e) => {
//             e.preventDefault();
//             const formData = new FormData(e.currentTarget);
//             const data = Object.fromEntries(formData.entries());
//             const payloadMessages = [
//               ...messages,
//               {
//                 role: "user",
//                 ...(data as { content: string }),
//               },
//               {
//                 role: "assistant",
//                 content: "",
//               },
//             ];
//             setMessages(payloadMessages as Messages);
//             formRef.current?.reset();
//             const response = await fetch("https://api.openai.com/v1/chat/completions", {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: "Bearer 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",
//               },
//               body: JSON.stringify({
//                 model : 'gpt-3.5-turbo',
//                 content: data.content,
//               }),
//             });

//             if (!response.body) return;
//             const reader = response.body.getReader();
//             const decoder = new TextDecoder();
//             let isFinished = false;
//             while (!isFinished) {
//               const { value, done } = await reader.read();
//               isFinished = done;

//               const decodedValue = decoder.decode(value);
//               if (!decodedValue) break;

//               setMessages((messages) => [
//                 ...messages.slice(0, messages.length - 1),
//                 {
//                   role: "assistant",
//                   content: `${messages[messages.length - 1].content}${decodedValue}`,
//                 },
//               ]);
//             }
//           }}
//         >
//           <div className="form-control">
//             <label>
//               <span className="label-text">Content</span>
//             </label>
//             <textarea name="content" rows={3} className="textarea textarea-bordered" required></textarea>
//           </div>
//           <div className="form-control mt-4">
//             <button type="submit" className="btn btn-primary">
//               Submit
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";

type Messages = {role: 'system' | 'user'| 'assistant', content: string}[]
export default function Home(){
  const [messages, setMessages] = useState<Messages>([
    {
      role: "system",
      content: " You are a helpful assistant."
    },
  ])
  
  return <div>
    <div className="container mx-auto pt-12">

      <div className="prose">
        {messages?.map((message, index) => <p key={(index)}>
          <em>{message.role}:</em>{message.content}</p>)}
      </div>

      <form onSubmit={async e =>{
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())

        setMessages((messages: Messages)   =>[...messages, {
          role: 'user',
          ...data as {content: string}
        }])
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer secretkey',
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: " You are a helpful assistant."
              },
              {
                role: "user",
                ...data
              }
            ],
            stream: true
          })
        })
        if(!response.body) return 
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        let isFinished = false
        while(!isFinished){
          const{done, value} = await reader.read()
          isFinished = done

          const decodedValue = decoder.decode(value)
          if (!decodedValue) break

          const message = decodedValue.split('\n\n')
          console.log(message)
          console.log(message.map(message => JSON.parse(message.replace(/^data:/g, '').trim())))
          // const json = JSON.parse(decodedValue.replace(/^data:\s/g, ''))
          // console.log(json)
        }  
          
        // setMessages(messages =>[...messages, {
        //   role: "assistant",
        //   content:  json.choices[0].message.content
        // }])
      }} >
        <div className="classname form-control">
          <label>
            <span className="label-text">Content</span>
          </label>
        <textarea required name="content" rows={3}  className="textarea textarea-bordered "></textarea>
        </div>
        <div className="form-control mt-4">
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </form>
    </div>

  </div>
}
