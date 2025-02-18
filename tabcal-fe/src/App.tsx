import './App.css'
import Calendar from './components/Calendar';
import { useEffect, useState } from 'react';
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import useDevice from './hooks/hooks';
import { merge } from '../utils/tw-merge';
import { useCalendarStore } from './store/CalendarStore';
import { useUserStore } from './store/UserStore';
import InputTabs from './components/InputTabs';
import { auth } from '../.secrets/firebase';
import { getUser } from '../utils/firestore';
import { UserDocument } from './types/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from './components/UI/Toast/Use-toast';

function App() {
    const [open ,isOpen] = useState<boolean>(false)
    const device = useDevice();
    const eventsJson = useCalendarStore((state) => state.eventsJson)
    const setUser = useUserStore((state) => state.setUser)
    // const setCreds = useUserStore((state) => state.setCreds)

    // use effect check for logged in account (onAuthStateChange)
    onAuthStateChanged(auth, async(user) => {
      if (user) {
        try {
          setUser(await getUser(user.uid) as UserDocument)
          // setCreds() 
        } catch (error) {
          toast({
            title: "an error occurred",
            description: "an error occurred",
            className: "bg-red-500 font-poppins text-white"
          })
        }
      }
    })

    useEffect(() => {
      if (eventsJson.length != 0) {
        isOpen(true);
      }
    },[eventsJson])

    const toggle = () => {
        isOpen(prev => !prev)
    }

    function getDrawerDimensions() {
      return device.width < 768 ? { width:"100%", height:"75%"}: { width: "90%", height:"60%"}
    }


  return (
    <div className="w-full flex flex-row">
      <div className="w-full md:w-1/3 px-10 pt-10 md:pt-20 flex flex-col">
        <InputTabs toggle={toggle}/>
      </div>

      <div className={merge("md:w-2/3", device.width > 768 ? "my-10 p-10 rounded-l-xl shadow-xl shadow-slate-400" : "")}>
        {device.width < 768 ?
          <Drawer
            open={open}
            onClose={toggle}
            direction={device.width < 768 ? "bottom" : "right"}
            style={{
              width: getDrawerDimensions().width,
              height: getDrawerDimensions().height
            }}
            className={merge("p-10 rounded-l-xl shadow-xl shadow-slate-400", device.width < 768 ? "" : "my-10")}>
              <Calendar />
          </Drawer>
         : <Calendar />}
      </div>
    </div>
  )
}

export default App
