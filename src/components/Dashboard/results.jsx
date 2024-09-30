import React from 'react';
import { ProgressBar } from 'react-bootstrap';

const Results = () => {
    const results = [
        { subject: 'Java Programming', score: 75 },
        { subject: 'Angular Theory', score: 25 },
        { subject: 'Data Structures', score: 85 },
        { subject: 'Architecture and Organization', score: 65 },
        { subject: 'Operating Systems', score: 75 },
    ];

    return (
        <div style={{width: 500, height: 400}}>
            {results.map((result, index) => (
                <div key={index} className="mb-3">
                    <h6>{result.subject}</h6>
                    <ProgressBar now={result.score} label={`${result.score}%`} />
                </div>
            ))}
        </div>
    );
};

export default Results;
