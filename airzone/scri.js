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
                  <div class="tour-box_img global-img">
                    <img src="${data.doc}" alt="image" />
                  </div>
                  <div class="tour-content">
                    <h3 class="box-title">
                      <a href="tour-details.html">${data.name}</a>
                    </h3>
                    
                    <h4 class="tour-box_price">
                      <span class="currency">₹${data.value}</span>/Person
                    </h4>
                    <div class="tour-action">
                      <a href="contact.html" class="th-btn style4 th-icon"
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