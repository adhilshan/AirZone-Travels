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

async function fetchData() {
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
                    <a href="https://wa.me/+919400312201?text=${doc.id}">${doc.id}</a>
                  </h4>
                </div>
                <div class="">
                  <a
                    href="https://wa.me/+919400312201?text=${doc.id}"
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
      const blogRef = fires.collection("airzone/blog/popular");
      try {
        const snapshot = await blogRef.get();
        if (snapshot.empty) {
          console.log("No blog.");
          return;
        }

        snapshot.forEach((doc) => {
          const data = doc.data();
          document.getElementById('blog-layout').innerHTML += `
              <div class="swiper-slide">
                <div class="blog-box th-ani">
                  <div class="blog-img global-img">
                    <img src="${data.doc}" alt="blog image" />
                  </div>
                  <div class="blog-box_content">
                    <h3 class="box-title">
                      <a href="#"
                        >${data.title}</a
                      >
                    </h3>
                    <p>
                    ${data.des}
                    </p>
                  </div>
                </div>
              </div>
          `;
        });
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      }
}

fetchData();

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

const db = firebase.firestore();

function generateFlightCard(date) {
  return `
    <ul class="list-group col-12" style="border: 1px solid #CCCCCC; border-radius: 10px; overflow:hidden;">
      <div style="display: flex;">
        <div class="col-4" style="padding: 10px; border-right: 1px solid #CCCCCC;">
          <div style="background: #1F3C42; color: #FFFFFF; display: flex; flex-direction: column; justify-content: center; align-items: center; border-radius: 10px;">
            <span style="text-align: center;">${date.month}</span>
            <span class="date" style="font-weight: 600; font-size: 2rem;">
              ${date.day}
            </span>
            <span style="text-align: center;">${date.year}</span>
          </div>
        </div>
        <div class="col-8">
          <li class="list-group-item" style="border: none;">
            <svg width="25px" height="25px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier"> 
                <g> 
                  <path fill="none" d="M0 0h24v24H0z"></path> 
                  <path d="M10.478 11.632L5.968 4.56l1.931-.518 6.951 6.42 5.262-1.41a1.5 1.5 0 0 1 .776 2.898L5.916 15.96l-.776-2.898.241-.065 2.467 2.445-2.626.704a1 1 0 0 1-1.133-.48L1.466 10.94l1.449-.388 2.466 2.445 5.097-1.366zM4 19h16v2H4v-2z"></path> 
                </g> 
              </g>
            </svg>
            ${date.from} ${date.fromTime}</li>
          <hr style="margin: 0;">
          <li class="list-group-item" style="border: none;">
            <svg width="25px" height="25px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier"> 
                <g> 
                  <path fill="none" d="M0 0h24v24H0z"></path> 
                  <path d="M10.254 10.47l-.37-8.382 1.933.518 2.81 9.035 5.261 1.41a1.5 1.5 0 1 1-.776 2.898L4.14 11.937l.776-2.898.242.065.914 3.35-2.627-.703a1 1 0 0 1-.74-.983l.09-5.403 1.449.388.914 3.351 5.096 1.366zM4 19h16v2H4v-2z"></path> 
                </g> 
              </g>
            </svg>
            ${date.to} ${date.toTime}</li>
          <hr style="margin: 0;">
          <li class="list-group-item" style="border: none;">Price : ₹${date.price}</li>
        </div>
      </div>
      <button type="button" class="btn btn-primary book-flight" data-flight-id="${date.id}" style="border-radius: 0 0 8px 8px; background: #1F3C42; border:none;">Book Now</button>
    </ul>
  `;
}

function updateFlightModal(flight) {
  document.getElementById('flightModalLabel').innerHTML = `
    <img src="${flight.logo}" alt="" style="height: 30px; object-fit: contain;">
    Flight Details - ${flight.takeoffShort} to ${flight.landShort}
  `;

  const modalBody = document.querySelector('#flightModal .modal-body');
  modalBody.innerHTML = flight.dates.map(date => generateFlightCard(date)).join('');

  document.querySelectorAll('.book-flight').forEach(button => {
    button.addEventListener('click', (e) => {
      const flightId = e.target.dataset.flightId;
      handleBooking(flightId);
    });
  });
}

async function getFlightData(fromCode, toCode) {
  try {
    const flightRef = db.collection('airzone/flights/offers')
      .where('takeoffShort', '==', fromCode)
      .where('landShort', '==', toCode);
    
    const snapshot = await flightRef.get();
    
    if (snapshot.empty) {
      console.log('No matching flights');
      return null;
    }

    const flightDoc = snapshot.docs[0];
    const flightData = flightDoc.data();

    const datesSnapshot = await db.collection('airzone/flights/offers')
      .doc(flightDoc.id)
      .collection('dates')
      .get();

    const dates = [];
    datesSnapshot.forEach(doc => {
      dates.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return {
      ...flightData,
      dates
    };
  } catch (error) {
    console.error('Error fetching flight data:', error);
    return null;
  }
}

async function handleBooking(flightId) {
  try {
    
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
    
    Toast.fire({
      icon: "success",
      title: "Starting booking process..."
    });
  } catch (error) {
    console.error('Error booking flight:', error);
    
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
    
    Toast.fire({
      icon: "error",
      title: "Error booking flight"
    });
  }
}

async function initializeFlightCards() {
  try {
    const snapshot = await db.collection('airzone/flights/offers').get();
    
    const flightCardsContainer = document.querySelector('.grid-offers');
    flightCardsContainer.innerHTML = '';
    
    snapshot.forEach(doc => {
      const flight = doc.data();
      const card = `
        <div class="child" data-bs-toggle="modal" data-bs-target="#flightModal" data-from="${flight.takeoffShort}" data-to="${flight.landShort}">
          <div class="a0">
            <img src="${flight.logo}" alt="">
          </div>
          <div class="a1">
            <span>${flight.takeoffShort}</span>
            <svg version="1.1" id="svg2" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" sodipodi:docname="plane.svg" inkscape:version="0.48.4 r9939" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30px" height="30px" viewBox="-48 -48 1296.00 1296.00" enable-background="new 0 0 1200 1200" xml:space="preserve" fill="#303030" stroke="#303030" stroke-width="0.012" transform="rotate(0)">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier"> 
                <path id="path16765" inkscape:connector-curvature="0" d="M321,1164h120l269.28-480.06H1020c0,0,180,0,180-83.94c0-84-180-84-180-84 H710.28L441,36H321l149.28,480H255.06L120,395.94H0l96.06,204L0,804h120l135.06-120.06h215.22L321,1164z"></path> 
              </g>
            </svg>
            <span>${flight.landShort}</span>
          </div>
          <hr style="margin: 8px 0;">
          <div class="a2">
            ${flight.takeoffFull} to ${flight.landFull}
          </div>
        </div>
      `;
      flightCardsContainer.innerHTML += card;
    });

    document.querySelectorAll('.child[data-bs-toggle="modal"]').forEach(card => {
      card.addEventListener('click', async () => {
        const fromCode = card.dataset.from;
        const toCode = card.dataset.to;
        
        const flightData = await getFlightData(fromCode, toCode);
        if (flightData) {
          updateFlightModal(flightData);
        } else {
          const Toast = Swal.mixin({
            toast: true,
            position: "bottom-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });
          
          Toast.fire({
            icon: "error",
            title: "No flights found for this route"
          });
        }
      });
    });
  } catch (error) {
    console.error('Error initializing flight cards:', error);
  }
}
initializeFlightCards();
