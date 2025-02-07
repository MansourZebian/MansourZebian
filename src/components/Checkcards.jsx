import React from 'react'

function Checkcards({ title, checked, checktitle, transparent,disabled }) {
  return (
    <div 
    className={
      disabled
        ? "rounded-3xl  w-full bg-[#c6cce9]  items-center p-4 mb-3"
        : "rounded-3xl  w-full bg-[#7a92fb]   items-center p-4 mb-3"
    }
    // className={transparent ? 'rounded-3xl  w-full bg-transparent border border-[#7a92fb] items-center p-4 mb-3' : 'rounded-3xl  w-full bg-[#7a92fb]   items-center p-4 mb-3'}
    
    
    >

      
      <div className='flex justify-between w-full'>

        <h1 className={transparent ? 'text-black font-semibold text-lg pt-3 pl-3' : 'text-white font-semibold text-lg pt-3 pl-3'}>{title}</h1>

        <div className="flex items-center justify-center">
          <div className='flex flex-col items-center'>
            <img src="svg/completecheck.svg" alt="check" className={checked ? "w-8 h-8 mb-2 bg-green-500 text-blue-600 dark:text-blue-500 group-hover:text-blue-600 dark:group-hover:text-blue-500" : "w-8 h-8 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"} />
            <p className={transparent ? 'text-black font-thin text-xs' : 'text-[#FFFFFF] font-thin text-xs'}>{checktitle}</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Checkcards