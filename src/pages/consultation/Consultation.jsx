import React, { useCallback, useRef, useState } from 'react'
import { FaRegClock } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";


export default function Consultation() {
  
//  https://api.timetap.com/test/sessionToken?apiKey=393827&timestamp=1712338992&signature=a0145bd3c2d113767b0973b568860e8f

//

  return (
    <div className='p-5'>

        <div className='mb-5 text-left'>
            <p className='text-black font-bold text-xl'>Nick Name: John</p>
            <p className='text-black font-bold text-xl'>Acc#: 348763</p>
        </div>

        <div className='flex'>
            <div className='mb-5 border border-[#C5C9EE] p-5 w-full rounded-sm'>  
                <center>
                <img src="logo.png" alt="" />
                <hr/>
                </center>   
                <img src="favicon.png" alt="" />     
                <p className='text-[#9b9b9b] font-bold text-md text-left'>RIVER Foundation</p>  
                <p className='text-black font-bold text-3xl text-left'>Free Ketamine Consultation</p>
                <p className='mt-3 text-[#9b9b9b] font-bold text-md text-left flex gap-2 items-center'><FaRegClock />10 mint</p>    
                <p className='mt-3 text-[#9b9b9b] font-bold text-md text-left flex gap-2 items-center'><FiPhone />Phone call</p> 
                <p className='text-[#9b9b9b] font-bold text-md text-left mt-3'>We will be ready for your call at a scheduled time for a free ketamine consultation </p>
            </div>
            {/* <div className='mb-5 border border-[#C5C9EE] p-5 w-full rounded-sm' > 
          
            </div> */}
        </div>



    </div>
  )
}


