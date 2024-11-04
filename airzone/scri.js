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