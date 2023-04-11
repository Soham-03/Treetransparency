import Head from "next/head";
import React, { useEffect, useState } from "react";
import styles from "./pay.module.css";
import tw from "twin.macro";
import Section1 from "../components/sections/section1.js";
import bgStyles from "../styles/bgStyles.module.css";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { auth } from "../services/firebase.js";
import { firestore } from "../services/firebase.js";
import { clcik } from "../services/transactweb3.js";
import Web3 from "web3";
import { abi } from "../services/transactweb3.js";
import { doc } from "firebase/firestore";
import { useUserContext } from "../services/userContext";
import { async } from "@firebase/util";
import { useRouter } from "next/router";
import LoadingAnimation from "../components/misc/Loading";

export default function pay() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [paySuccess, setPaySuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState("");
  let web3;
  const [defaultacc, setdefaultacc] = useState();
  const [transhash, settranshash] = useState("");
  const { user } = useUserContext();
  const [localData, setLocalData] = useState();
  const [orgs, setOrgs] = useState([]);
  const [price, setPrice] = useState([]);
  const router = useRouter();
  function connect() {
    web3 = new Web3(window.ethereum);
    window.ethereum.enable().catch((error) => {
      // User denied account access
      console.log(error);
    });
    const AgentContract = new web3.eth.Contract(abi);
    web3.eth.defaultAccount = web3.currentProvider.selectedAddress;
    setdefaultacc(web3.eth.defaultAccount);
    return web3.currentProvider.selectedAddress;
  }

  useEffect(async () => {
    connect();
    fetchUser();
   fetchAmount();
  }, []);

  function fetchUser() {
    const docRef = collection(firestore, "Users");
    // alert()
    getDocs(docRef)
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          setOrgs([...orgs, doc.data().fname + " " + doc.data().lname]);
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function fetchAmount() {
    const docRef = collection(firestore, "SellTrees");
    let data=[];
    // alert()
    getDocs(docRef)
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          data.push(doc.data().treePrice);
          setPrice(data);
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  


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
            clcik(defaultacc, amount, (hash) => {
              settranshash(hash);
              addDoc(collection(firestore, "payments"), {
                name,
                amount,
                hash,
                fromname: auth.currentUser.displayName,
                ...res,
              })
                .then(() => console.log("Document was saved"))
                .catch((e) => alert(`Error occured : ${JSON.stringify(e)}`));
            });
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
      
      <h1 className={styles.title}>Adopt Trees</h1>
      <p className={styles.description}>
          "Think green. Be green. "
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
            transhash={transhash}
          />
        ) : (
          <div className={styles.grid}>
            <div className="grid gap-5 mb-10 w-full">
              {/* <input
              placeholder="Name"
              className={styles.input}
              type="select"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            /> */}
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-state"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              >
                <option value="Select">Select</option>
                {orgs.map((e) => (
                  <option value={e}>{e}</option>
                ))}
              </select>

              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-state"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              >
                <option value="Select">Select</option>
                {Array.isArray(price) && price.map((e) => (
                  <option value={e}>{e}</option>
                ))}
              </select>

              {/*<input
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                placeholder="Amount"
                // className={styles.input}
                type="number"
                name="Amount"
                id="Amount"
                value={amount}
                onChange={(e) => setAmount(e.currentTarget.value)}
              />*/}
            </div>

            <div className="grid place-items-center">
              <button
                className={styles.btn}
                // onClick={() => clcik(web3.eth.defaultAccount)}
                onClick={() => displayRazorpay(amount)}
              >
                Adopt Now
              </button>
              {/*<div className={styles.or}>OR</div>
              <div>
                <a
                  className="donate-with-crypto"
                  href="https://commerce.coinbase.com/checkout/e8bfba4f-9db2-44aa-a5c4-67cd37112f69"
                >
                  Adopt with Leaf Tokens
                </a>
                <script src="https://commerce.coinbase.com/v1/checkout.js?version=201807"></script>
              </div>*/}
            </div>
          </div>
        )}
      </main>
     
    </div>
  );
}

function SuccessPage({ payment_id, amount, transhash }) {
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
        <div className="flex gap-3 text-lg">
          <p>Transaction Hash: </p>
          <p>{transhash}</p>
        </div>
      </div>
    </div>
    
  );
}



 
   