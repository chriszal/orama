import React, {useState} from 'react'
import Footer from '../components/Footer';
import Hero from '../components/Hero'
import Info from '../components/Info'
import { homeObjOne, homeObjTwo, homeObjThree} from '../components/Info/Data';
import MapComponent from '../components/Locations';
import Navbar from '../components/Navbar'
import Services from '../components/Services';
import Sidebar from '../components/SideBar'
import ContactUs  from '../components/Contact';

const Home = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () =>{
    setIsOpen(!isOpen);
  }

  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <Navbar toggle={toggle}/>
      <Hero />
      <Info {...homeObjOne}/>
      <MapComponent/>
      {/* <Info {...homeObjTwo}/> */}
      <ContactUs />
      
      {/* <Info {...homeObjThree}/> */}
      <Footer />
    </>
  )
}

export default Home
