import { useOutletContext, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Fuse from 'fuse.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

function AdminList() {

    // eslint-disable-next-line
    const [parks, setParks, trails, setTrails] = useOutletContext();

    const navigate = useNavigate()

    const [searchState, setSearchState] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState('');


    if (!parks || !trails) {
        return 'Loading...'
    };

    const parksHTML = parks.map((park) => (
        <Link
            style={{ display: "block", margin: "1rem 0" }}
            to={`park/${park.id}`}
            key={park.id}
        >
            {park.name}
        </Link>
    ))
    
    const trailsHTML = trails.map((trail) => (
        <Link
            style={{ display: "block", margin: "1rem 0" }}
            to={`trail/${trail.id}`}
            key={trail.id}
        >
            {trail.name}
        </Link>

    ))

    let resultsHtml;

    const options = {
        isCaseSensitive: false,
        includeScore: true,
        shouldSort: true,
        includeMatches: false,
        findAllMatches: false,
        minMatchCharLength: 1,
        keys: [
            "name",
        ]
    };

    const fuse = new Fuse([...trails, ...parks], options);

    if (results.length > 0) {
        resultsHtml = results.map((item, index) => item.latitude ?
            <div className='result' key={index} onMouseDown={() => navigate(`park/${item.id}`)}>{item.name}</div>
            :
            <div className='result' key={index} onMouseDown={() => navigate(`trail/${item.id}`)}>{item.name}</div>
        )
    } else {
        resultsHtml = <div>'No matching trails'</div>
    };

    const runSearch = (e) => {
        setSearchState(e.target.value);
        const data = fuse.search(e.target.value)
        const newData = data
            .map((result) => (result.item));
        setResults(newData)
    }


    return (
        <div className='admin-list-wrapper'>
            <div className='full-width search'>
                <input
                    className='search-bar'
                    type='text'
                    onChange={runSearch}
                    name='search'
                    value={searchState}
                    onFocus={() => setIsSearching(true)}
                    onBlur={() => {
                        setIsSearching(false)
                        setSearchState('')
                    }}
                    autoComplete='off'
                    placeholder='search trails'
                />
                <FontAwesomeIcon className='search-icon gray-font' icon={faMagnifyingGlass} />
                <div className={isSearching ? 'search-results' : 'hidden search-results'}>
                    {isSearching && resultsHtml}
                </div>
            </div>
                <Accordion className='admin-list'>
                    <Accordion.Item eventKey='0'>
                        <Accordion.Header>Parks</Accordion.Header>
                        <Accordion.Body>
                            <ul>{parksHTML}</ul>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey='1'>
                        <Accordion.Header>Trails</Accordion.Header>
                        <Accordion.Body>
                            <ul>{trailsHTML}</ul>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
        </div>
    )
}

export default AdminList