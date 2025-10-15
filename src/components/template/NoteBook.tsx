import React from 'react'
import SideBar from '../organism/SideBar'
import MainBar from '../organism/MainBar'

function NoteBook() {
  return (
    <div className='flex '>
        <SideBar />
        <MainBar />
    </div>
  )
}

export default NoteBook