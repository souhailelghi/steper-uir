// import React from "react";
// // import Stepper from "./components/Stepper/Stepper";
// import ReservationForm from '../src/components/Reservation/ReservationForm';
// const App = () => {
//   return (
//     <div className="bg-gray-900 flex flex-col gap-10 h-screen items-center justify-center">
//       {/* <Stepper /> */}
//       <h1>Reservation Form : </h1>
//       <ReservationForm />
//     </div>
//   );
// };

// export default App;




//todo : reservation with form token : 
// import React, { useState } from 'react';
// import InputForm from '../src/components/ReservationWithFormToken/InputForm';
// import ReservationForm from '../src/components/ReservationWithFormToken/ReservationForm';

// const App = () => {
//   const [credentials, setCredentials] = useState({ sportId: '', token: '' });

//   const handleCredentialsSubmit = ({ sportId, token }) => {
//     setCredentials({ sportId, token });
//   };

//   return (
//     <div className="bg-gray-900 flex flex-col gap-10 h-screen items-center justify-center">
//       <h1>Reservation Form</h1>
//       <InputForm onSubmit={handleCredentialsSubmit} />
//       {credentials.sportId && credentials.token && (
//         <ReservationForm sportId={credentials.sportId} token={credentials.token} />
//       )}
//     </div>
//   );
// };

// export default App;

//todo : ((((((()))))))

import React from 'react';
import Stepper from './components/Stepper'; 

const App = () => {
  return (
    <div>
   
      <Stepper />
    </div>
  );
};

export default App;
