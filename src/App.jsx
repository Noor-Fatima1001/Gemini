import React from 'react'
import Sidebar from './Components/Sidebar/Sidebar'
import Main from './Components/Main/Main'

const App = () => {
  return (
    <div >
       <div style={{display: 'flex' }}>
        <Sidebar/>
        <Main/>
        </div>
      
    </div>
  )
}

export default App
