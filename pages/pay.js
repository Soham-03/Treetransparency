import Head from "next/head";
import React, { useState } from "react";
import styles from "./pay.module.css";
import {
  addDoc,
  collection,
} from "firebase/firestore";
import { firestore } from "../services/firebase.js";

export default function pay() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [paySuccess, setPaySuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState("");

  function validateFormWithJS() {
    const Amount = document.getElementById("Amount").value;

    if (!Amount) {
      alert("Please enter Amount.");
      return false;
    }
    // displayRazorpay(Amount)
  }
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };
  const displayRazorpay = async (Amount) => {
    console.log(Amount);
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Basic cnpwX3Rlc3RfRDRzRHVKNWEzZkVMeDE6d1ZnMVRMYzJpZEtkZDc1QlZEVFRRaVow"
    );
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      amount: Amount * 100,
      currency: "INR",
    });

    var requestOptions = {
      method: "POST",
      mode: "no-cors",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://api.razorpay.com/v1/orders", requestOptions)
      .then(async (result) => {
        const res = await loadScript(
          "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
          alert("you are offline");
          return;
        }

        const options = {
          key: "rzp_test_W488yU9uOndfwZ",
          amount: Amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: "INR",
          name: "",
          description: "Test Transaction",
          handler: function (res) {
            addDoc(collection(firestore, "payments"), { name, amount, ...res })
              .then(() => console.log("Document was saved"))
              .catch((e) => alert(`Error occured : ${JSON.stringify(e)}`));

            setPaySuccess(true);
            setPaymentDetails({
              ...res,
              amount: Amount,
            });
          },
          // "order_id": "order_KTL3lGufa5nvgB", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          order_id: result.order_id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
          theme: {
            color: "#3399cc",
          },
        };
        var rzp1 = new Razorpay(options);
        rzp1.open();
      })
      .catch((error) => console.log("error", error));
    //     return;
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Payment Page</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Donation</h1>

        <p className={styles.description}>
          No one has ever become poor from giving
        </p>

        {/* <SuccessPage payment_id={"130213"} amount={10} /> */}

        {/* <button className="bg-white" onClick={() => {
            addDoc(collection(firestore, "payments"), { name: "Deon" })
              .then(() => console.log("Document was saved"))
              .catch((e) => alert(`Error occured : ${JSON.stringify(e)}`));

        }}>Check Firebase</button> */}

        {paySuccess ? (
          <SuccessPage
            payment_id={paymentDetails.razorpay_payment_id}
            amount={paymentDetails.amount}
          />
        ) : (
          <div className={styles.grid}>
            <input
              placeholder="Name"
              className={styles.input}
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />

            <input
              placeholder="Amount"
              className={styles.input}
              type="number"
              name="Amount"
              id="Amount"
              value={amount}
              onChange={(e) => setAmount(e.currentTarget.value)}
            />

            <button
              className={styles.btn}
              onClick={() => displayRazorpay(amount)}
            >
              Donate Now
            </button> 
    <div>
      <a className="donate-with-crypto"
        href="https://commerce.coinbase.com/checkout/e8bfba4f-9db2-44aa-a5c4-67cd37112f69">
        Donate with Crypto 
      </a>
      <script src="https://commerce.coinbase.com/v1/checkout.js?version=201807">
      </script>
    </div>

          </div>
          
        )}
      </main>
    </div>
  );
}

function SuccessPage({ payment_id, amount }) {
  return (
    <div className="container mx-auto mt-4">
      <div className="shadow-md bg-white grid place-items-center rounded-md p-10 gap-3">
        <h2 className="text-4xl text-green-600 font-bold">
          Payment Successful
        </h2>
        <div className="flex gap-3 text-lg">
          <p>Payment ID: </p>
          <p>{payment_id}</p>
        </div>
        <div className="flex gap-3 text-lg">
          <p>Amount: </p>
          <p>{amount}</p>
        </div>
      </div>
    </div>
  );
}
