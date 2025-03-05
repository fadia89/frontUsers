import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {
  // Stocke la réponse de l'API contenant les utilisateurs.
  const [users, setUsers] = useState([]); 

  //Indique si les données sont en cours de chargement
  const [loading, setLoading] = useState(true);

  //Stocke l'erreur si elle se produit
  const [error, setError] = useState(null)
  //stocke les informations de formulaires
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [telephone, setTelephone] = useState('');
  const [address, setAddress] = useState('');
  const [hobbies, setHobbies] = useState(['']);
  const [newHobby, setNewHobby] = useState('');
 // Message de confirmation après ajout
  const [confirmationMessage, setConfirmationMessage] = useState('');

  // Fonction pour récupérer les utilisateurs depuis l'API
  const fetchUsers = async () => {
    try {
      setLoading(true); // On commence à charger les données
      const response = await axios.get('http://localhost:8000/api/users'); 
      setUsers(response.data);
    } catch (err) {
      console.log('Erreur :', err);
      setError(err.message);
      
    } finally {
      setLoading(false); // On arrête de charger 
    }
  };

  const handleSubmit  = async (e) => {
    //console.log(e)
    e.preventDefault()
    console.log(firstName, lastName,telephone, address,hobbies)
    try{
      const addNewUser = await axios.post('http://localhost:8000/api/users',{firstName, lastName,telephone, address,hobbies: hobbies}); 
      setConfirmationMessage('Utilisateur ajouté avec succès !');
    }catch (err) {
      console.log('Erreur :', err);
      setConfirmationMessage('Une erreur est survenue lors de l\'ajout de l\'utilisateur.');
    } finally {
      fetchUsers() // Met à jour la liste des utilisateurs
    }
  }

  const handleAddHobby = async(e) => {
    e.preventDefault()
    setHobbies ([...hobbies, newHobby]) // Ajoute le nouveau hobby à la liste
    setNewHobby(['']) // Réinitialise le champ de texte
  }
  

  useEffect(() => {
    fetchUsers();
  }, []); //signifie qu'on appelle cette fonction une seule fois au chargement du composant

  return (
    <>
    <div className="app-container">
      <h1>Hello users!</h1>
      
      {/* Affiche le message de chargement si la donnée est en cours de récupération */}
      {loading && <p>Chargement...</p>}
      {/* Affiche un message d'erreur en cas d'échec */}
      {error && <p>{error}</p>}
      
      

      {users && !loading &&
        users.map((user, index) => (
          <div key={user.id} className="user-card">
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
        )
      ) 
    }
    </div>
    <form onSubmit={handleSubmit}>
      <input type ="text" placeholder = 'firstName' onChange={(e) => setFirstName (e.target.value) } required/>
      <input type ="text" placeholder = 'lastName' onChange={(e) => setLastName (e.target.value) } required/>
      <input type ="text" placeholder = 'telephone' onChange={(e) => setTelephone (e.target.value) } required/>
      <input type ="text" placeholder = 'address' onChange={(e) =>  handleHobbyChange(e, index) } required/>

      {/* Champs dynamiques pour les hobbies */}
      <input type ="text" placeholder = 'hobby' onChange={(e) => setNewHobby(e.target.value) } required/>
      <button type="button" value={newHobby} onClick={handleAddHobby}>Ajouter  hobby</button><br></br>
       <div>
          <ul>
            {hobbies.map((hobby,index) => (
               <li key={index}>{hobby}</li>
            )
          )}
          </ul>

      </div>
      <input type="submit" />
      </form>
    </>
  );
};

export default App;
