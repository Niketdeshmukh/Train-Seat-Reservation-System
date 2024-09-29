import React, { useState, useEffect } from "react";
import axios from "axios";
// import Seat from "./components/Seat";
import Modal from "./components/Modal";
import "./App.css";

const App = () => {
  const [seats, setSeats] = useState([]);
  const [numSeats, setNumSeats] = useState(0);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState(""); 
  const [modalType, setModalType] = useState("error");

  useEffect(() => {
    const fetchSeats = async () => {
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/seats`);
      console.log("Fetching from:", `${process.env.REACT_APP_BACKEND_BASEURL}/api/seats`); // Log the URL
      setSeats(data);
    };
    fetchSeats();
  }, []);

  const handleSeatClick = (seat) => {
    if (seat.booked) return; // Prevent selecting booked seats

    if (selectedSeats.includes(seat.seatNo)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat.seatNo)); // Deselect
    } else {
      setSelectedSeats([...selectedSeats, seat.seatNo]); // Select
    }
  };

  const handleBooking = async () => {
    // Check if no seats are selected
    if (selectedSeats.length === 0) {
      setModalMessage("Please select at least one seat to book.");
      setModalType("error");
      setShowModal(true);  // Ensure this is set to true to display the modal
      return; // Make sure the function stops here if no seats are selected
    }
  
    try {
      // Proceed with booking if seats are selected
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASEURL}/api/seats/book`, {
        numSeats: selectedSeats.length,
        seatNumbers: selectedSeats,
      });
  
      if (response.data.bookedSeats) {
        setBookedSeats([...bookedSeats, ...response.data.bookedSeats]);
        setSelectedSeats([]); // Clear selected seats after booking
  
        // Trigger success modal
        setModalMessage("Your seat is booked. Please refresh the page to confirm.");
        setModalType("success");
        setShowModal(true);

        setTimeout(() => {
          window.location.reload(); // Refresh the page
        }, 3000);
      } else {
        console.error("Booking failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error during booking:", error);
    }
  };
  console.log("Selected Seats:", selectedSeats);
  console.log("Show Modal:", showModal);
    
  const closeModal = () => setShowModal(false);
  const availableSeats = seats.filter((seat) => !seat.booked);

  return (
    <div className="App">
    <h1 className="cool-heading">Train Seat Booking System</h1>

    

    {/* Seat Layout */}
    <div className="seat-layout">
      {seats.map((seat) => (
        <button
          key={seat.seatNo}
          className={`seat ${
            seat.booked
              ? "booked"
              : selectedSeats.includes(seat.seatNo)
              ? "selected"
              : ""
          }`}
          onClick={() => handleSeatClick(seat)}
          disabled={seat.booked}
        >
          {seat.seatNo}
        </button>
      ))}
    </div>

    {/* Legend */}
    <div className="legend">
      <div className="legend-item">
        <div className="legend-box legend-available"></div> Available
      </div>
      <div className="legend-item">
        <div className="legend-box legend-booked"></div> Booked
      </div>
      <div className="legend-item">
        <div className="legend-box legend-selected"></div> Selected
      </div>
    </div>
    <button onClick={handleBooking} className="booking-button">Book Selected Seats</button>
    {/* Booked Seats */}
    <div className="booked-seats">
      <h3>Booked Seats:</h3>
      {bookedSeats.length === 0 ? (
        <p>No seats booked yet</p>
      ) : (
        <ul>
          {bookedSeats.map(seat => (
            <li key={seat}>{seat}</li>
          ))}
        </ul>
      )}
    </div>

    {/* Available Seats */}
    <div className="available-seats">
      <h3>Available Seats:</h3>
      <ul>
        {availableSeats.map(seat => (
          <div className="legend-item" style={{display:'inline-block', marginTop:'8px'}}>
          <li className="legend-box " key={seat.seatNo}>{seat.seatNo}</li></div>
        ))}
      </ul>
    </div>
     {/* Modal */}
     {showModal && (
  <Modal
    message={modalMessage}
    onClose={closeModal}
    type={modalType}  // Pass the modal type (success or error)
  />
)}


  </div>
);
};

export default App;
