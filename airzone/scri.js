const firebaseConfig = {
  apiKey: "AIzaSyCV1Z8-EZWdUwPnsAiPrRn6hScbt9_AnHs",
  authDomain: "kaisonline.firebaseapp.com",
  projectId: "kaisonline",
  storageBucket: "kaisonline.appspot.com",
  messagingSenderId: "1038384566126",
  appId: "1:1038384566126:web:0a2dab22a90c750066bb7f",
  measurementId: "G-336STKC5HQ",
};

firebase.initializeApp(firebaseConfig);
const fires = firebase.firestore();


function dwnld() {
  if (document.getElementById("tic_num").value.trim() != "") {
    fires
      .collection("airzone/tickets/flight")
      .doc(document.getElementById("tic_num").value)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          window.open(data.doc);
          document.getElementById("tic_num").value = "";
        } else {
          alert("Your ticket not found on our servers!");
        }
      })
      .catch((error) => {
        console.error("Error getting document:", error);
      });

  }
}

async function fetchDestinations() {
  const destsref = fires.collection("airzone/destinations/popular");
  try {
    const snapshot = await destsref.get();
    if (snapshot.empty) {
      console.log("No destinstions.");
      return;
    }
    const dataContainer = document.getElementById("data");
    snapshot.forEach((doc) => {
      const data = doc.data();
      document.getElementById('destn-layout').innerHTML += `
        <div class="swiper-slide dests">
          <div class="destination-box gsap-cursor">
            <div class="destination-img">
              <img
                src="${data.doc}"
                alt="destination image"
              />
              <div class="destination-content">
                <div class="media-left">
                  <h4 class="box-title">
                    <a href="${data.url} ">${doc.id}</a>
                  </h4>
                </div>
                <div class="">
                  <a
                    href="${data.url}"
                    class="th-btn style2 th-icon"
                    >Book Now</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

      `;
    });
  } catch (error) {
    console.error("Error fetching Firestore data:", error);
  }
}

fetchDestinations();
async function fetchPackage(){
  const packageRef = fires.collection("airzone/packages/popular");
    try {
      const snapshot = await packageRef.get();
      if (snapshot.empty) {
        console.log("No packages.");
        return;
      }
      snapshot.forEach((doc) => {
        const data = doc.data();
        document.getElementById('package-layout').innerHTML += `
              <div class="swiper-slide">
                <div class="tour-box th-ani gsap-cursor">
                  <div class="tour-box_img global-img" onclick="window.location.href='/tour-details/?package=${data.name}'">
                    <img src="${data.doc}" alt="image" />
                  </div>
                  <div class="tour-content">
                    <h3 class="box-title">
                      <a href="/tour-details/?package=${data.name}">${data.name}</a>
                    </h3>
                    
                    <h4 class="tour-box_price">
                      <span class="currency">₹${data.value}</span>/Person
                    </h4>
                    <div class="tour-action">
                      <a href="/tour-details/?package=${data.name}" class="th-btn style4 th-icon"
                        >Book Now</a
                      >
                    </div>
                  </div>
                </div>
              </div>
          `;
        });
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      }
}
fetchPackage();
document.getElementById('flight-num').addEventListener('input', ()=>{
  document.getElementById('flight-num').value = document.getElementById('flight-num').value.toUpperCase();
})

async function checkFlight(){
  if (document.getElementById('flight-num').value.trim() == "") {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "error",
      title: "Flight Number is Required"
    });
    return null;
  }

  try {
    const flightNum = document.getElementById('flight-num').value;
    const response = await fetch(`https://api.aviationstack.com/v1/flights?access_key=5f6b6ed1bf10462376a52cc7808665b6&flight_iata=${flightNum}`);
    const data = await response.json();
    if (data.data && data.data.length > 0) {
      const flight = data.data[0];
      document.querySelector('.airline').textContent = flight.airline?.name || 'Unknown Airline';
      document.querySelector('.airlineslip').textContent = flight.airline?.name || 'Unknown Airline';
      document.querySelector('.jfk').textContent = flight.departure?.iata || 'N/A';
      document.querySelector('.jfkslip').textContent = flight.departure?.iata || 'N/A';
      document.querySelector('.sfo').textContent = flight.arrival?.iata || 'N/A';
      document.querySelector('.sfoslip').textContent = flight.arrival?.iata || 'N/A';
      document.querySelector('.name span').textContent = 'From : ' + flight.departure?.airport || 'N/A';
      document.querySelector('.seat span').textContent = 'To : ' +flight.arrival?.airport || 'N/A';
      document.querySelector('.boardingtime span').innerHTML = 
        `${new Date(flight.departure?.scheduled).toLocaleString() || 'N/A'} - ${new Date(flight.arrival?.scheduled).toLocaleString() || 'N/A'}` + '<br> Status : ' + flight.flight_status + ' | Departure Terminal : '+ flight.departure.terminal + ' | Departure Gate : ' + flight.departure.gate;
    } else {
      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "error",
        title: "Flight Not Found"
      });
      return;
    }
  } catch (error) {
    console.error('Error fetching flight data:', error);
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "error",
      title: "Error fetching flight data"
    });
    return;
  }

  document.querySelector('.popup-airline').style.display = 'flex';
}
if (window.innerWidth < 600) {
  document.getElementById('ticket-cont').style.transform = 'rotate(90deg)';
  document.getElementById('ticket-close').style.top = 'unset';
  document.getElementById('ticket-close').style.bottom = '30px';
  document.getElementById('ticket-close').style.right = '-10px';
  document.getElementById('ticket-close').style.transform = 'rotate(90deg)';
}
