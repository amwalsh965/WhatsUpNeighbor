import React, { useState, useEffect } from 'react'
import './App.css'
import SearchBar from "../components/general/SearchBar";

function Home() {
    const handleSearch = async (searchTerm) => {
        console.log("Searching for something: ", searchTerm);
    };

    return (
        <div>
            <h1 className="homeText">What do you need?</h1>
            <SearchBar onSearch={handleSearch} />
            <NavBar></NavBar>
        </div>
        
    );
}

export default Home;