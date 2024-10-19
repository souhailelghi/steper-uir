
//todo : ----------------------------- ------------------------------

import React, { useEffect, useState } from "react";
import axios from "axios";
import { TiTick } from "react-icons/ti";
import "../components/Stepper/stepper.css";


const Stepper = ({ sportId, token: propToken }) => {
  const steps = ["Token Authorization", "Choisir Sport", "Choisir Match", "Réserver terrain"];
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [token, setToken] = useState(propToken || "");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [matches, setMatches] = useState([]); 
    //----
  const [studentId, setStudentId] = useState('');
  const [dayBooking] = useState(5); 
  const [hourStart, setHourStart] = useState('');
  const [hourEnd, setHourEnd] = useState('');
  const [studentIdList, setStudentIdList] = useState('');

  //--
  const [day, setDay] = useState('');
  const [timeRanges, setTimeRanges] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  
  const [errors, setErrors] = useState(null);

  const handleTimeRangeSelect = (timeRange) => {
    if (timeRange) {
      setHourStart(timeRange.hourStart);
      setHourEnd(timeRange.hourEnd);
    } else {
      setHourStart('');
      setHourEnd('');
    }
  };

//   const handleSubmitaddReservation = async (e) => {
//     e.preventDefault();

//     const studentIds = studentIdList.split(',').map((id) => id.trim());

//     const reservationData = {
//       studentId,
//       sportId:"e3c1b585-941b-4798-ae84-6b1ed147f397",
//       reservationDate: new Date().toISOString(),
//       dayBooking, 
//       hourStart,
//       hourEnd,
//       studentIdList: studentIds,
//       dateCreation: new Date().toISOString(),
//       dateModification: new Date().toISOString(),
//     };

//     try {
//       const response = await axios.post(
//         'https://localhost:7125/api/Reservations/AddReservations',
//         reservationData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log('Reservation created:', response.data);
//     } catch (error) {
//       console.error('Error creating reservation:', error);
//       setError("Failed to create reservation.");
//     }
//   };

  const handleInputChange = (e) => {
    setToken(e.target.value);
  };

  const validateToken = async () => {
    if (token) {
      try {
        setLoading(true);
        const response = await axios.get('https://localhost:7125/api/SportCategorys/list', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Token validation successful");
        setSports(response.data);
        setIsAuthorized(true);
        setTokenError("");
      } catch (error) {
        setIsAuthorized(false);
        setTokenError("Token invalide, veuillez réessayer.");
        setError(error.response ? error.response.data : 'Error fetching data');
      } finally {
        setLoading(false);
      }
    } else {
      setTokenError("Veuillez entrer un token.");
    }
  };





  const fetchMatchesForCategory = async (categoryId) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://localhost:7125/api/Sports/category/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("data cat :" ,response);
        // Assuming response.data is an array of sports
    response.data.forEach(sport => {
        console.log("Sport ID:", sport.id); // Log the ID of each sport
      });
   
      
      setMatches(response.data);
      setError("");
    } catch (error) {
      setError("Failed to fetch matches for the selected category.");
    } finally {
      setLoading(false);
    }
  };



  const handleSubmitaddReservation = async (e) => {
    e.preventDefault();

    const studentIds = studentIdList.split(',').map((id) => id.trim());
  // Get the sportId from the selectedSport or the matches array
     const selectedSportObject = matches.find(match => match.title === selectedCategory);

     const sportId = selectedSportObject ? selectedSportObject.id : "";

     console.log('selectedSportObject : is !!!', selectedSportObject);
    console.log('sportId : is !!!', sportId);
    


    const reservationData = {
      studentId,
      sportId,
      reservationDate: new Date().toISOString(),
      dayBooking, 
      hourStart,
      hourEnd,
      studentIdList: studentIds,
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString(),
    };

    try {
      const response = await axios.post(
        'https://localhost:7125/api/Reservations/AddReservations',
        reservationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Reservation created:', response.data);
    } catch (error) {
      console.error('Error creating reservation:', error);
      setError("Failed to create reservation.");
    }
  };

  const handleSportSelection = (e) => {
    const selectedSportName = e.target.value;
    setSelectedSport(selectedSportName);
    setSelectedCategory(""); 

    const selectedSportObject = sports.find(sport => sport.name === selectedSportName);
    console.log('selected sport : ', selectedSportObject);
    console.log('selected sport id : ', selectedSportObject.id);
    
    if (selectedSportObject && selectedSportObject.id) {
      fetchMatchesForCategory(selectedSportObject.id);
    }
  };

  const handleFinishReservation = () => {
    setComplete(true);
    // setCurrentStep(1);
    window.location.reload(); 
  };
// todo : ''''''''''''''''''''''''
  // Set day to today's day
  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
    setDay(dayOfWeek);
  }, []);

  // Fetch time ranges whenever sportId or day changes
  useEffect(() => {
    if (sportId && day) {
      fetchTimeRanges();
    }
  }, [sportId, day]);

  const fetchTimeRanges = async () => {
    try {
      setLoading(true);
      setErrors(null);
      
      const response = await axios.get(
    
        `https://localhost:7125/api/Plannings/get-timeRanges-by-sport-and-day-not-reserved/${sportId}/${day}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      
      setTimeRanges(response.data);
    } catch (err) {
      setErrors('Error fetching time ranges');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeRangeChange = (e) => {
    const selectedRange = timeRanges.find((tr) => tr.id === e.target.value);
    setSelectedTimeRange(selectedRange);
    handleTimeRangeSelect(selectedRange); 
  };

  const handleclickImag = async (e) => {

    // const selectedSportName = e.target.value;
    // setSelectedSport(selectedSportName);
    // setSelectedCategory(""); 

    // const selectedSportObject = sports.find(sport => sport.name === selectedSportName);
    // console.log('selected sport : ', selectedSportObject);
    // console.log('selected sport id : ', selectedSportObject.id);
    
    // if (selectedSportObject && selectedSportObject.id) {
    //   fetchMatchesForCategory(selectedSportObject.id);
    // }
    try {
        setLoading(true);
        setErrors(null);
        var sportIdd = "e3c1b585-941b-4798-ae84-6b1ed147f397";
        var tkn = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZGFtQGpvYmludGVjaC11aXIubWEiLCJqdGkiOiJhNzQwNTgzZC05YTZlLTQyMDctOGFlZi03YzAzODcyYTRmZWYiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJVc2VyIiwiZXhwIjoxNzI5NDY1ODQ0LCJpc3MiOiJGcmVlVHJhaW5lZCJ9.DI6S7R9s8knou0hID07siYIw8u--NxfCVIks2p0FsRE";

        const response = await axios.get(
      
          `https://localhost:7125/api/Plannings/get-timeRanges-by-sport-and-day-not-reserved/${sportIdd}/${day}`,
          {
            headers: {
              Authorization: `Bearer ${tkn}`,
            },
          }
        );
        console.log(response.data);
        
        setTimeRanges(response.data);
      } catch (err) {
        setErrors('Error fetching time ranges');
      } finally {
        setLoading(false);
      }
  }
   return (
    <div className="container mx-auto mt-8 p-6 max-w-2xl bg-white">
      <div className="flex justify-between">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`step-item ${currentStep === i + 1 && "active"} ${(i + 1 < currentStep || complete) && "complete"}`}
          >
            <div className="step">
              {i + 1 < currentStep || complete ? <TiTick size={24} /> : i + 1}
            </div>
            <p className="text-gray-500">{step}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
           
        {/* //todo : step 1 : -----------------------------------------------------   */}
        {currentStep === 1 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Enter your token for authorization:</h3>
            <input
              type="text"
              className="select"
              value={token}
              onChange={handleInputChange}
              placeholder="Enter Token"
            />
            <div className="mt-10">
              <button onClick={validateToken} className="btn btn-primary">Validate Token</button>
              {/* <button onClick={validateTime} className="btn btn-primary">Validate Time</button> */}


            </div>
            {tokenError && <p className="text-red-600 mt-2">{tokenError}</p>}
          </div>
        )}
               
        {/* //todo : step 2 : -----------------------------------------------------   */}
        {currentStep === 2 && isAuthorized && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Choisissez un sport :</h3>
            {loading && <p>Loading sports...</p>}
            {error && <p className="text-red-600">{error}</p>}
            <select
              className="select"
              value={selectedSport}
              onChange={handleSportSelection}
            >
              <option value="">-- Sélectionnez un sport --</option>
              {sports.map((sport, index) => (
                <option key={index} value={sport.name}>
                  {sport.name}
                </option>
              ))}
            </select>
            {selectedSport && (
              <p className="mt-2 text-green-600">Sport sélectionné : {selectedSport}</p>
            )}
          </div>
        )}

         
        {/* //todo : step 3 : -----------------------------------------------------   */}

        {currentStep === 3 && selectedSport && matches.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Choisissez un match pour {selectedSport} :</h3>
            <div className="card-container">
              {matches.map((match, index) => (
                <div
                  key={index}
                  className={`card ${selectedCategory === match.title ? "selected" : ""}`}
                  onClick={() => setSelectedCategory(match.title)}
                >
                  <img 
                    src={match.image ? `data:image/png;base64,${match.image}` : 'placeholder.png'} 
                    alt={match.name} 
                    style={{ width: '100px', height: '100px' }} 
                    onClick={handleclickImag}
                  />
                  <p>{match.name}</p>
                </div>
              ))}
            </div>
            {selectedCategory && (
              <p className="mt-2 text-green-600">Match sélectionné : {selectedCategory}</p>
            )}
          </div>
        )}

        
        {/* //todo : step 4 : ----------------------------------------------------- Form reservation :  */}
        {currentStep === 4 && selectedSport && matches.length > 0 && (
          <form onSubmit={handleSubmitaddReservation}>
            <div>
              <label>Student ID:</label>
              {/* id studnet //////////////////////////// */}
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              />
            </div>
       
              <div>
      <h1>Get Available Time Ranges for {day}</h1>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {timeRanges.length > 0 && !loading && (
        <div>
          <h2>Select Available Time Range</h2>
          <form>
            {timeRanges.map((timeRange) => (
              <div key={timeRange.id}>
                <input
                  type="radio"
                  id={`timeRange-${timeRange.id}`}
                  name="timeRange"
                  value={timeRange.id}
                  onChange={handleTimeRangeChange}
                />
                <label htmlFor={`timeRange-${timeRange.id}`}>
                  {timeRange.hourStart} - {timeRange.hourEnd}
                </label>
              </div>
            ))}
          </form>
        </div>
      )}

      {timeRanges.length === 0 && !loading && !error && <p>No time ranges available</p>}
    </div>
            <div>
              <label>Student ID List :</label>
                {/* id studnet //////////////////////////// */}
              <input
                type="text"
                value={studentIdList}
                onChange={(e) => setStudentIdList(e.target.value)}
                required
              />
            </div>
            <button  className="btn btn-primary" type="submit" >Add Reservation</button>
          </form>
        )}

        <div className="flex justify-between mt-6 -mx-6">
          {currentStep > 1 && !complete && (
            <button
              className="btn btn-secondary"
              onClick={() => setCurrentStep((prev) => prev - 1)}
            >
              Précédent
            </button>
          )}
          {currentStep === steps.length ? (
            <button className="btn btn-success" onClick={handleFinishReservation}>
              Fin
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              disabled={complete || (currentStep === 2 && !selectedSport)}
            >
              Suivant
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stepper;






