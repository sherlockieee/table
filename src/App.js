import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import data from './data/users.json'
import {useState, useEffect} from 'react';

function App() {

  const [objectKeys, setObjectKeys] = useState([]);
  const [userData, setUserData] = useState([])

  useEffect(() => {
    let dataObjectKeys = [];
    Object.keys(data[0]).forEach(key => dataObjectKeys.push(key));
    setObjectKeys([...dataObjectKeys]);
    setUserData([...data]);
  }, [])

  const parseDate = (jsonDate) => {
    const correctFormat = new Date(jsonDate).toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'})
    return correctFormat
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
  }

  const filterBy = async (value) => {
    if (value.length > 0) {
      let search = await arraySearch(userData, value);
      setUserData([...search]);
    } else {
      setUserData([...data]);
    }
  }

  const arraySearch = (data, value) => {
    const searchTerm = value.toLowerCase();
    return data.filter(el => {
      return objectKeys.some(key => {
        console.log(el[key])
        return String(el[key]).toLowerCase().includes(searchTerm);
      })
    })
  }
  return (
    <div className="App">
      <h1> A simple web app </h1>
      <div>
      <label htmlFor="sort">Order by:</label>
      <select name = "sort" id = "sort" onChange = {(e) => sortBy(e.target.value)}>
        {
          objectKeys.map(key => {
            return <option value ={key}>{makeNamePretty(key)}</option>
          })
        }
      </select>
      </div>
      <div>
      <label htmlFor = "filterBy">Filter: </label>
      <input name = "filterBy" id = "filterBy" onChange = {(e) => filterBy(e.target.value)}></input>
      </div>
      <table className="table"   data-pagination="true">
        <thead>
          <tr>
            {objectKeys.map(key => {
              return <th scope = "col">{makeNamePretty(key)}</th>
            } )}
          </tr>
        </thead>
        <tbody>
          {userData.map(el => 
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
      <div>
        
      </div>
    </div>
  );
}

export default App;
