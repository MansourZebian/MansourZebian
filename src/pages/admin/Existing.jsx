import React from 'react'
import Sidebar from '../../components/Sidebar'
import { IoIosArrowDown } from 'react-icons/io'

function Existing() {
  return (
    <>
    <button data-drawer-target="sidebar-multi-level-sidebar" data-drawer-toggle="sidebar-multi-level-sidebar" aria-controls="sidebar-multi-level-sidebar" type="button" class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
<span class="sr-only">Open sidebar</span>
<svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
<path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
</svg>
</button>

<Sidebar/>
<div class="p-10 sm:ml-64 bg-[#f7f7f7]">

    <div className='flex items-center  gap-5'>
      
        <h1 className='text-4xl font-bold'>Existing</h1>
        <IoIosArrowDown size={30} className='mt-2' />
    </div>

    <div className='mt-10 relative overflow-x-auto'>
    <div class="rounded-t-xl rounded-b-xl overflow-hidden">
<table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
    <thead class="h-20 text-lg text-black bg-[#f0f1fa]">
        <tr>
            <th scope="col" class="px-6 py-3">
            Name
            </th>
            <th scope="col" class="px-6 py-3">
            Forms Filled
            </th>
            <th scope="col" class="px-6 py-3">
            Invoice Paid
            </th>
            <th scope="col" class="px-6 py-3">
            Invoice
            </th>
            <th scope="col" class="px-6 py-3">
            Call Scheduled
            </th>
            <th scope="col" class="px-6 py-3">
            Added to MDtoolbox
            </th>
            <th scope="col" class="px-6 py-3">
            Script sent
            </th>
            <th scope="col" class="px-6 py-3">
            Script
            </th>
            <th scope="col" class="px-6 py-3">
            Tracking Available
            </th>
            <th scope="col" class="px-6 py-3">
            Type
            </th>
            <th scope="col" class="px-6 py-3">
            Status
            </th>
        </tr>
    </thead>
    <tbody>

        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                Apple MacBook Pro 17"
            </th>
            <td class="px-6 py-4">
                <input type='checkbox' />
            </td>
            <td class="px-6 py-4">
            <input type='checkbox' />
            </td>
            <td class="px-6 py-4">
                $2999
            </td>
            <td class="px-6 py-4">
            <input type='checkbox' />
            </td>
            <td class="px-6 py-4">
            <input type='checkbox' />
            </td>
            <td class="px-6 py-4">
            <input type='checkbox' />
            </td>
            <td class="px-6 py-4">
                $2999
            </td>
            <td class="px-6 py-4">
            <input type='checkbox' />
            </td>
            <td class="px-6 py-4">
             New participant
            </td>
            <td class="px-6 py-4">
             In progress
            </td>
        </tr>
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                Apple MacBook Pro 17"
            </th>
            <td class="px-6 py-4">
                <input type='checkbox' />
            </td>
            <td class="px-6 py-4">
            <input type='checkbox' />
            </td>
            <td class="px-6 py-4">
                $2999
            </td>
            <td class="px-6 py-4">
            <input type='checkbox' />
            </td>
            <td class="px-6 py-4">
            <input type='checkbox' />
            </td>
            <td class="px-6 py-4">
            <input type='checkbox' />
            </td>
            <td class="px-6 py-4">
                $2999
            </td>
            <td class="px-6 py-4">
            <input type='checkbox' />
            </td>
            <td class="px-6 py-4">
             New participant
            </td>
            <td class="px-6 py-4">
             In progress
            </td>
        </tr>
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                Apple MacBook Pro 17"
            </th>
            <td class="px-6 py-4">
                <input type='checkbox' />
            </td>
            <td class="px-6 py-4">
            <input type='checkbox' />
            </td>
            <td class="px-6 py-4">
                $2999
            </td>
            <td class="px-6 py-4">
            <input type='checkbox' />
            </td>
            <td class="px-6 py-4">
            <input type='checkbox' />
            </td>
            <td class="px-6 py-4">
            <input type='checkbox' />
            </td>
            <td class="px-6 py-4">
                $2999
            </td>
            <td class="px-6 py-4">
            <input type='checkbox' />
            </td>
            <td class="px-6 py-4">
             New participant
            </td>
            <td class="px-6 py-4">
             In progress
            </td>
        </tr>
        


    </tbody>

    
    

        
</table>

<nav aria-label="Page navigation example" className='mt-5'>
<ul class="flex items-center -space-x-px h-8 text-sm">
<li>
  <a href="#" class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
    <span class="sr-only">Previous</span>
    <svg class="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
    </svg>
  </a>
</li>
<li>
  <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
</li>
<li>
  <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
</li>
<li>
  <a href="#" aria-current="page" class="z-10 flex items-center justify-center px-3 h-8 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
</li>
<li>
  <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">4</a>
</li>
<li>
  <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">5</a>
</li>
<li>
  <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
    <span class="sr-only">Next</span>
    <svg class="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
    </svg>
  </a>
</li>
</ul>
</nav>
</div>

         
    </div>

</div>
</>
  )
}

export default Existing