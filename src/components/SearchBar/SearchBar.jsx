// eslint-disable-next-line no-unused-vars
import React from 'react';
import '../../styles/styles.css';
import { UilSearch } from '@iconscout/react-unicons';

const SearchBox = () => {
    return (
        <div className="search-box">
            <UilSearch className="uil uil-search"></UilSearch>
            <input type="text" placeholder="Search here..." />
        </div>
    );
};

export default SearchBox;
