import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Screeningform from "./pages/screening/Screeningform";
import Form from "./pages/screening/form";
import Questionnaire from "./pages/screening/Questionnaire";
import Administrativeform from "./pages/administrative/Administrativeform";
import Consentform from "./pages/administrative/Consentform";
import Informationform from "./pages/administrative/Informationform";
import Emergencycontact from "./pages/administrative/Emergencycontact";
import Documentverification from "./pages/administrative/Documentverification";
import Refill from "./pages/Refill";
import Payment from "./pages/Payment";
import Survey from "./pages/Survey";
import Consultation from "./pages/consultation/Consultation";
import Setting from "./pages/admin/Setting";
import Dashboard from "./pages/admin/Dashboard";
import Existing from "./pages/admin/Existing";
import Userprofile from "./pages/admin/Userprofile";
import Inbox from "./pages/admin/Inbox";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthGuard from "./auth/AuthGuard";
import Chatting from "./pages/Chatting";
import Screeningformquestionnaire from "./pages/admin/Screeningformquestionnaire";
import Account from "./pages/Account";
import Info from "./pages/Info";
import Help from "./pages/admin/Help";
import ScreeningQuestionstable from "./pages/admin/Questionstable";
import TrackingLink from "./pages/TrackingLink";

import AdminAccount from '../src/components/AdminAccount';
import RefillForm from "./pages/screening/refillForm";
import HelpUser from "./pages/HelpUser";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <AuthGuard>
                <Home />
              </AuthGuard>
            }
          />



          <Route
            path="/admin/*"
            element={
              <AuthGuard>
                <Routes>




                  <Route
                    path="/screeningquestiontable"
                    element={<ScreeningQuestionstable />}
                  />
                  <Route
                    path="/screeningformquestionaire"
                    element={<Screeningformquestionnaire />}
                  />
                  <Route path="/setting" element={<Setting />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/existing" element={<Existing />} />
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/filter/:type" element={<Dashboard />} />
                  <Route path="/userprofile/:id" element={<Userprofile />} />
                  <Route path="/inbox" element={<Inbox />} />
                  <Route path="/account" element={<AdminAccount />} />


                  {/* added */}



                </Routes>
              </AuthGuard>
            }
          />


          <Route path="/help" element={<HelpUser />} />
          <Route path="/account" element={<Account />} />
          <Route path="/info" element={<Info />} />
          <Route path="/chatting" element={<Chatting />} />
          <Route path="/screening" element={<Screeningform />} />
          <Route path="/screening/:type" element={<Form />} />
          <Route path="/refill/:type" element={<RefillForm />} />
          <Route path="/screening/questionnaire" element={<Questionnaire />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/administrative" element={<Administrativeform />} />
          <Route path="/administrative/consent" element={<Consentform />} />
          <Route
            path="/administrative/information"
            element={<Informationform />}
          />
          <Route
            path="/administrative/emergencycontact"
            element={<Emergencycontact />}
          />
          <Route
            path="/administrative/documentverification"
            element={<Documentverification />}
          />
          <Route path="/refill" element={<Refill />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/TrackingLink/:id" element={<TrackingLink />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
