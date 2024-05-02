import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from "axios"
import Print_del from "./MongodB"
import  ChatApp from "./message_print" 
import DownloadCSVButton from "./csv_file"

const socket = io.connect("http://localhost:3002", {
    withCredentials: true,
    extraHeaders: {
        "Access-Control-Allow-Origin": "http://localhost:3000 http://localhost:57886"
    }
});

const ResponseForm = ({ responseData }) => {
    const [formData, setFormData] = useState({});
    const [documents, setDocuments] = useState([]);
    const [push, setPush] = useState(false);

    useEffect(() => {
        const handleDataBase = (document) => {
            setDocuments((prevDocuments) => [...prevDocuments, document]);
        };
        socket.on('dataBase', handleDataBase);

        return () => {
            socket.off('dataBase', handleDataBase);
        };
    }, []);

    const Handleclick = (e) => {
        e.preventDefault();
        const stringifiedData = JSON.stringify(formData); // Stringify the formData
        console.log('Form Data:', stringifiedData);
        socket.emit("data_joined", formData); 
        setPush(true);
        
    };

    const handleChange = (e, fieldName) => {
        const { value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: value,
        }));
    };

    if (push) { 
        return(
         <div>
        <h1>User Data</h1>    
        <Print_del/>
        </div>   )
        
    }

    return (
        <form>
            {responseData && Object.keys(responseData).map((key) => (
        <div key={key} className="input-container">
          <label htmlFor={responseData[key].fieldName} className="label">
            {responseData[key].fieldName}
          </label>
          <input
            type="text"
            id={responseData[key].fieldName}
            name={responseData[key].fieldName}
            value={formData[responseData[key].fieldName] || ''}
            onChange={(e) => handleChange(e, responseData[key].fieldName)}
          />
          <div className="underline"></div>
        </div>
      ))}
      

      <div className="form-button-container">
        <button className="button" onClick={Handleclick}>Submit</button>
      </div>
        </form>
    );
    
};

export default ResponseForm_1;