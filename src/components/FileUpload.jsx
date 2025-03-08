import { useState } from 'react';
import Papa from 'papaparse';
import './FileUpload.css';
import * as React from 'react';



const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [arrayOfClasses, setArrayOfClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [classCounts, setClassCounts] = useState({});

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }


    Papa.parse(file, {
      header: true,
      complete: (results) => { 
        setArrayOfClasses(results.data);
        setError(null);
        filterClasses(results.data);
      },
      error: (err) => {
        console.error('Error parsing CSV file:', err);
        setError("An error occurred while parsing the file.");
      }
    });
  };

  const filterClasses = (classes) => {
    const filtered = classes.filter(item => { 
      return item['Duration (Minutes)'] > 40 && item.Participants > 4;
    });
    setFilteredClasses(filtered);

    
    const counts = filtered.reduce((acc, item) => {
      acc[item.Topic] = (acc[item.Topic] || 0) + 1;
      return acc;
    }, {});
    setClassCounts(counts);
  };

  return (
    <div className='file-upload-container'>
      <input
        className='file-upload'
        type="file"
        onChange={handleFileChange}
      />

      <button onClick={handleSubmit} className='submit-button'>Enter</button>

      {error && <p style={{ color: 'red' }} className='error'>Error: {error}</p>}

      {Object.keys(classCounts).length > 0 && (
        <div className='class-counts'>
          <h3 className='header-count'>Number of the classes:</h3>
          <ul>
            {Object.entries(classCounts).map(([topic, count]) => (
              <li key={topic} className='class-count'>
                {`${topic}: ${count} classes`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;