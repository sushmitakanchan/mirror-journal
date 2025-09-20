import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout'
import Signup from './components/Signup';
import Login from './components/Login';
import History from './components/History';
import NewEntry from './components/NewEntry';
import EntryView from './components/EntryView';

function App() {
  

  return (
  <Router>
    <Routes>
      <Route path='/' element={<Layout/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/history' element={<History/>}/>
      <Route path='/newEntry' element={<NewEntry/>}/>
      <Route path='/entryView' element={<EntryView/>}/>
    </Routes>
  </Router>
  )
}

export default App
