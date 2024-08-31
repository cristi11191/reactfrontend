// eslint-disable-next-line no-unused-vars
import React, {useContext} from 'react';
import '../../styles/styles.css';
import { UilSearch } from '@iconscout/react-unicons';
import SearchContext from "../../contexts/SearchContext.jsx";

const SearchBox = () => {
    const { searchQuery, setSearchQuery } = useContext(SearchContext);

    const handleChange = (event) => {
        setSearchQuery(event.target.value);
    };
    return (
        <div className="search-box">
            <UilSearch className="uil uil-search"></UilSearch>
            <input type="text" placeholder="Search here..."  value={searchQuery} onChange={handleChange}/>
        </div>
    );
};

export default SearchBox;
