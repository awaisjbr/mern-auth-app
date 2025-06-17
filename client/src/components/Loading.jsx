import {Loader} from "lucide-react"

const Loading = () => {
  return (
    <div className='h-screen w-full flex items-center justify-center absolute top-0 left-0' style={{background:"rgba(0,0,0,0.7)", zIndex:"1"}}>
        <Loader color='green' strokeWidth={2} className='animate-spin size-16'/>
    </div>
  )
}

export default Loading