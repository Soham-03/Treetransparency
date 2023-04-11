import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import styled from "styled-components";
import tw from "twin.macro";
import { SectionHeading as HeadingTitle } from "../components/misc/Headings.js";
import bgStyles from "../styles/bgStyles.module.css";
import { useUserContext } from "../services/userContext";

// import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { doc, updateDoc, getDocs, serverTimestamp, collection,updateCollection} from "firebase/firestore";

import { firestore } from '../services/firebase.js';
import { useRouter } from "next/router";

const Container = tw.div`relative bg-transparent`;

const SingleColumn = tw.div`max-w-screen-xl mx-auto py-20 lg:py-24`;

const FormContainer = tw.div`w-full flex-1 mt-8`;
const Form = tw.form`mx-auto max-w-xl`;
// const Input = tw.input`px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-300 placeholder-gray-600 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
const SubmitButton = styled.button`
  ${tw`mx-3 mt-5 tracking-wide font-semibold bg-primary-500 text-gray-100 w-full py-4 rounded-lg hover:bg-primary-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;

export default function editListing() {

    const {user} = useUserContext();
    const router = useRouter();
    const [listingData, setListing] = useState([]);
    const [treeTitle, setTreeTitle] = useState();
    const [treeDescription, setTreeDescription] = useState();
    const [Status, setStatus] = useState("Select");
    const [treeHeight, setTreeHeight] = useState();
    //const [treeThickness, setTreeThickness] = useState();
    const [treeSpecies, setTreeSpecies] = useState();
    const [file, setFile] = useState();
    const [treeState, setTreeState] = useState();
    const [treeCity, setTreeCity] = useState();
    const [treeAddress, setTreeAddress] = useState();
    const [treePinCode, setTreePinCode] = useState();
    //const [contactName, setContactName] = useState();
    //const [contactEmail, setContactEmail] = useState();
    //const [contactPhone, setContactPhone] = useState();
    const [treePrice, setTreePrice] = useState();
    const [statusError, setStatusError] = useState(false);
   let statusErrorLocal=false;
    
    /*const [fname, setFname] = useState();
    const [lname, setLname] = useState();
    const [phone, setPhone] = useState();
    const [type, settype] = useState("Select");
  
    // Error handlers
    const [typeError, settypeError] = useState(false);
   
    let typeErrorLocal = false;*/
   

    useEffect(async () => {
           fetchListings();
           }, [user])

           function fetchListings(){
            const docRef = collection(firestore, "SellTrees");
            let data=[];
            getDocs(docRef)
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                data.push(doc.data());
                setListing(data);
              });
            })
           
                

                let isEditing = window.localStorage.getItem("listingEditing");

                // Redirect to profile if the user's profile is complete and he/she don't want to edit
                if (listingData.treeTitle!==null && isEditing === false) { router.push("/profile"); }

                setTreeTitle(listingData.treeTitle ?? null);
                setTreeDescription(listingData.treeDescription ?? null);
                setStatus(listingData.Status ?? "Select");
                setTreeHeight(listingData.treeHeight ?? null);
                setTreeSpecies(listingData.treeSpecies ?? null);
                setFile(listingData.file ?? null);
                setTreeState(listingData.treeState ?? null);
                setTreeCity(listingData.treeCity ?? null);
                setTreeAddress(listingData.treeAddress ?? null);
                setTreePinCode(listingData.treePinCode ?? null);
                setTreePrice(listingData.treePrice ?? null);
               
                /*setLname(userData.lname ?? null);
                setPhone(userData.phone ?? null);
                settype(userData.type ?? "Select");*/

            }
    function handleFileChange(event) {
        if (!event.target.files) return;
      
        setFile(event.target.files[0]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let data = { treeTitle,treeDescription,Status, treeHeight,treeSpecies,file,treeState,treeCity,treeAddress,treePinCode,treePrice};

        

        if (Status == "Select") {
            setStatusError(true);
            statusErrorLocal = true;
        }
        else {
            setStatusError(false);
            statusErrorLocal = false;
        }

        
        
        if (statusErrorLocal == false ) {            
            try {

                // Add the user data to the database
                const docRef = collection(firestore, 'SellTrees');
                await updateCollection(docRef, { ...data, lastUpdated: serverTimestamp() });

                window.localStorage.setItem("listingData", JSON.stringify(data));
                window.localStorage.setItem("listingEditing", false);
                alert("Data submitted successfully");
                router.push("/profile");
                

            } catch (e) {
                alert("Error saving the data: ", e);
            }

        }
    }


    return (
        <>
            <Head>

                <title>Edit Listing</title>
                <link rel="icon" href="/favicon.ico" />

                {/* Meta tags */}
                <meta charset="UTF-8" />
                
            </Head>

            <div className={bgStyles.parent}>
                <div className={bgStyles.stars}></div>
                <Container>
                    <SingleColumn>
                        <HeadingTitle> Edit Listing </HeadingTitle>
                        <FormContainer>

                        <Form validate={true} onSubmit={handleSubmit}>
                        <div className="flex flex-wrap mb-6">   
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-500 text-md font-bold mb-2" htmlFor="grid-first-name">
                                    Listing Title:
                                </label>
                                <input
                                    className="placeholder-gray-600 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500 focus:bg-white"
                                    id="grid-first-name"
                                    type="text"
                                    required
                                    value={treeTitle}
                                    onChange={(e) => setTreeTitle(e.target.value)}
                                />

                            </div>
                            <div className="w-full md:w-1/2 px-3">
                                <label className="block uppercase tracking-wide text-gray-500 text-md font-bold mb-2" htmlFor="grid-last-name">
                                    Description:
                                </label>
                                <textarea
                                    className="placeholder-gray-600 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 rows=10 cols=10"
                                    id="grid-last-name"
                                    type="text"
                                    required
                                    value={treeDescription}
                                    onChange={(e) => setTreeDescription(e.target.value)}
                                />
                            </div>
                        </div>
                       

                        <div className="flex flex-wrap mb-6">
                            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-500 text-md font-bold mb-2" htmlFor="grid-state">
                                    Tree Status:
                                </label>
                                <div>
                                    <select
                                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-state"
                                        onChange={(e) => setStatus(e.target.value)}
                                        value={Status}
                                        required
                                    >
                                         <option value="Select">Select</option>
                                        <option value="Healthy">Standing Up</option>
                                        <option value="Fallen Down">Fallen Down</option>
                                        <option value="Cut Down">Cut Down</option>
                                        <option value="Requires Care">Requires Care</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                    {statusError ? <p className="text-red-500 text-xs italic">Please fill out this field.</p> : null}
                                </div>
                                </div>
                                </div>
                            
                            <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-500 text-md font-bold mb-2" htmlFor="grid-first-name">
                                    Tree Height:
                                </label>
                                <input
                                    className="placeholder-gray-600 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500 focus:bg-white"
                                    id="grid-first-name"
                                    type="number"
                                    required
                                    value={treeHeight}
                                    onChange={(e) => setTreeHeight(e.target.value)}
                                /></div>
                                {/* <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-500 text-md font-bold mb-2" htmlFor="grid-first-name">
                                    Trunk Thickness:
                                </label>
                                <input
                                    className="placeholder-gray-600 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500 focus:bg-white"
                                    id="grid-first-name"
                                    type="text"
                                    required
                                    value={treeThickness}
                                    onChange={(e) => setTreeThickness(e.target.value)}
                                /></div>*/}

<div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-500 text-md font-bold mb-2" htmlFor="grid-first-name">
                                    Tree Species:
                                </label>
                                <input
                                    className="placeholder-gray-600 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500 focus:bg-white"
                                    id="grid-first-name"
                                    type="text"
                                    required
                                    value={treeSpecies}
                                    onChange={(e) => setTreeSpecies(e.target.value)}
                                /></div>

                        <div className="flex flex-wrap mb-2">
                            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-500 text-md font-bold mb-2" htmlFor="grid-state">
                                    Upload Images
                                </label>
                                <div className="text-white">
                                    <input 
                                        type="file"
                                        accept="image/*" 
                                        onChange={handleFileChange}
                                        multiple
                                     />
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <h3>Tree Location:</h3>
                            </div>
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-500 text-md font-bold mb-2" htmlFor="grid-first-name">
                                    State:
                                </label>
                                <input
                                    className="placeholder-gray-600 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500 focus:bg-white"
                                    id="grid-first-name"
                                    type="text"
                                    required
                                    value={treeState}
                                    onChange={(e) => setTreeState(e.target.value)}
                                /></div>

<div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-500 text-md font-bold mb-2" htmlFor="grid-first-name">
                                    City:
                                </label>
                                <input
                                    className="placeholder-gray-600 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500 focus:bg-white"
                                    id="grid-first-name"
                                    type="text"
                                    required
                                    value={treeCity}
                                    onChange={(e) => setTreeCity(e.target.value)}
                                /></div> 

<div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-500 text-md font-bold mb-2" htmlFor="grid-first-name">
                                    Address:
                                </label>
                                <textarea
                                    className="placeholder-gray-600 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500 focus:bg-white rows=10 cols=10"
                                    id="grid-first-name"
                                    type="text"
                                    required
                                    value={treeAddress}
                                    onChange={(e) => setTreeAddress(e.target.value)}
                                /></div>

<div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-500 text-md font-bold mb-2" htmlFor="grid-first-name">
                                    PinCode:
                                </label>
                                <input
                                    className="placeholder-gray-600 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500 focus:bg-white"
                                    id="grid-first-name"
                                    type="text"
                                    required
                                    value={treePinCode}
                                    onChange={(e) => setTreePinCode(e.target.value)}
                                /></div>
                                 

{/*<div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-500 text-md font-bold mb-2" htmlFor="grid-first-name">
                                    Name:
                                </label>
                                <input
                                    className="placeholder-gray-600 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500 focus:bg-white"
                                    id="grid-first-name"
                                    type="text"
                                    placeholder="Type your name here."
                                    required
                                    value={contactName}
                                    onChange={(e) => setContactName(e.target.value)}
                                /></div>

<div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-500 text-md font-bold mb-2" htmlFor="grid-first-name">
                                    Email:
                                </label>
                                <input
                                    className="placeholder-gray-600 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500 focus:bg-white"
                                    id="grid-first-name"
                                    type="email"
                                    placeholder="@gmail.com"
                                    required
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                /></div>

<div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-500 text-md font-bold mb-2" htmlFor="grid-first-name">
                                    Contact No:
                                </label>
                                <input
                                    className="placeholder-gray-600 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500 focus:bg-white"
                                    id="grid-first-name"
                                    type="number"
                                    required
                                    value={contactPhone}
                                    onChange={(e) => setContactPhone(e.target.value)}
                                /></div><br></br>*/}

<div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-500 text-md font-bold mb-2" htmlFor="grid-first-name">
                                    Price:
                                </label>
                                <input
                                    className="placeholder-gray-600 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500 focus:bg-white"
                                    id="grid-first-name"
                                    type="text"
                                    placeholder="In Rupees"
                                    required
                                    value={treePrice}
                                    onChange={(e) => setTreePrice(e.target.value)}
                                /></div>

                                   
                                    <SubmitButton type="submit">
                                        <span className="text">Submit</span>
                                    </SubmitButton>

                                </div>
                            </Form>
                        </FormContainer>
                    </SingleColumn>
                </Container>
            </div>
        </>

    );
}


