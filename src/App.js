import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import data from './data/users.json'
import {useState, useEffect} from 'react';

function App() {

  const [objectKeys, setObjectKeys] = useState([]);
  const [userData, setUserData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let dataObjectKeys = [];
    Object.keys(data[0]).forEach(key => dataObjectKeys.push(key));
    setObjectKeys([...dataObjectKeys]);
    setUserData([...data]);
    setCurrentData(data.slice(0, 10));
    
  }, [])

  const parseDate = (jsonDate) => {
    const correctFormat = new Date(jsonDate).toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'})
    return correctFormat;
  };

  const parsePhone = (jsonPhone) => {
    let newPhone = ["(+84)"]
    newPhone.push(...jsonPhone.split("-"))
    return newPhone.join("")
  }

  const makeNamePretty = (name) => {
    const result = name.replace( /([A-Z])/g, " $1" );
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
  }
  
  const sortBy = (value) => {
    const newUserData = userData.sort(function(a, b) {
      if (a[value] < b[value]){
        return -1;
      } else if (a[value] > b[value]) {
        return 1;
      } else {
        return 0;
      }
    });

    setUserData([...newUserData]);
    setCurrentData(newUserData.slice(0, 10));
    setCurrentPage(1);
  }

  const filterBy = async (value) => {
    if (value.length > 0) {
      let search = await arraySearch(data, value);
      setUserData([...search]);
      setCurrentData(search.slice(0, 10));
      setCurrentPage(1);
    } else {
      setUserData([...data]);
      setCurrentData(data.slice(0, 10));
      setCurrentPage(1);
    }
  }

  const arraySearch = (data, value) => {
    const searchTerm = value.toLowerCase();
    return data.filter(el => {
      return objectKeys.some(key => {
        return String(el[key]).toLowerCase().includes(searchTerm);
      })
    })
  }

  const renderPagination = () => {
    const noOfPaignations = new Array(Math.ceil(userData.length/ 10)).fill(0).map((e,i)=>i+1);
    if (noOfPaignations.length >= 2){
      return noOfPaignations.map((page) =>{
        return <button id = {page} className =  "btn btn-small btn-light"
        value = {page} onClick={(e) => handlePaginationClick(e.target.value)}>
          {page}
        </button>
      } )
    }
    ;    
  }

  const handlePaginationClick = (pageNo) => {
    const currentData = userData.slice((pageNo - 1) * 10, pageNo * 10);
    setCurrentData(currentData);
    setCurrentPage(pageNo);
    renderPagination();
  }

  return (
    <div className="App container">
      <h1> A simple web app </h1>
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <label className="input-group-text" htmlFor="orderBy">Order by: </label>
        </div>
        <select className="custom-select" id="orderBy" onChange = {(e) => sortBy(e.target.value)}>
        {
            objectKeys.map(key => {
              return <option value ={key}>{makeNamePretty(key)}</option>
            })
          }
        </select>
      </div>
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text" id="basic-addon1">Filter by: </span>
        </div>
        <input type="text" className="form-control" onChange = {(e) => filterBy(e.target.value)}
        placeholder="None" aria-label="Username" aria-describedby="basic-addon1"/>
      </div>
      <div className = "paginationVals">
          {renderPagination()}
      </div>
      <table className="table"  data-pagecount="10">
        <thead>
          <tr>
            {objectKeys.map(key => {
              return <th scope = "col">{makeNamePretty(key)}</th>
            } )}
          </tr>
        </thead>
        <tbody>
          {currentData.map(el => 
          <tr>
            {objectKeys.map (key => {
              if (key === 'phone'){
                return <td>{parsePhone(el[key])}</td>;
              } else if (key === 'birthday'){
                return <td>{parseDate(el[key])}</td>;
              } else {
                return <td>{el[key]}</td>;
              }
            })}
            
          </tr>)}
        </tbody>
      </table>

      
    </div>
  );
}

export default App;
