import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {
  // Stocke la réponse de l'API contenant les utilisateurs.
  const [users, setUsers] = useState([]); 

  //Indique si les données sont en cours de chargement
  const [loading, setLoading] = useState();

  //Stocke l'erreur si elle se produit
  const [error, setError] = useState()

  // Fonction pour récupérer les utilisateurs depuis l'API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:{PORT}/api/users'); 
      setUsers(response.data);
    } catch (err) {
      console.log('Erreur :', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); //signifie qu'on appelle cette fonction une seule fois au chargement du composant

  return (
    <div className="app-container">
      <h1>Hello users!</h1>

      {users && users.length > 0 ? (
        users.map((user, index) => (
          <div key={index} className="user-card">
            <h3>First Name: {user.firstName}</h3>
            <h4>Last Name: {user.lastName}</h4>
            <h4>Telephone: {user.telephone}</h4>
            <h4>Address: {user.address}</h4>
            <h4>Hobbies:</h4>
            <ul>
              {user.hobbies.map((hobby, hobbyIndex) => (
                <li key={hobbyIndex}>{hobby}</li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default App;
