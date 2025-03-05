import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {
  // Stocke la réponse de l'API contenant les utilisateurs.
  const [users, setUsers] = useState([]); 

  // Indique si les données sont en cours de chargement
  const [loading, setLoading] = useState(true);

  // Stocke l'erreur si elle se produit
  const [error, setError] = useState(null);

  // Stocke les informations du formulaire
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [telephone, setTelephone] = useState('');
  const [address, setAddress] = useState('');

  // Stocke les hobbies sous forme de tableau
  const [hobbies, setHobbies] = useState([]);
  
  // Stocke le hobby actuellement saisi dans le champ de texte
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

  // Soumission du formulaire pour ajouter un utilisateur
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(firstName, lastName, telephone, address, hobbies);
    try {
      // Envoi des données au backend, y compris les hobbies sous forme de tableau
      await axios.post('http://localhost:8000/api/users', {
        firstName,
        lastName,
        telephone,
        address,
        hobbies: hobbies // On envoie le tableau des hobbies
      });
      setConfirmationMessage('Utilisateur ajouté avec succès !');
    } catch (err) {
      console.log('Erreur :', err);
      setConfirmationMessage('Une erreur est survenue lors de l\'ajout de l\'utilisateur.');
    } finally {
      fetchUsers(); // Met à jour la liste des utilisateurs
    }
  };

  // Fonction pour ajouter un hobby à la liste des hobbies
  const handleAddHobby = (e) => {
    e.preventDefault();
    if (newHobby.trim() !== '') {
      setHobbies([...hobbies, newHobby]); // Ajoute le nouveau hobby à la liste
      setNewHobby(''); // Réinitialise le champ de texte (vide)
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // Appelé une seule fois lors du chargement du composant

  return (
    <>
      <div className="app-container">
        <h1>Hello users!</h1>
        
        {/* Affiche le message de chargement si la donnée est en cours de récupération */}
        {loading && <p>Chargement...</p>}
        {/* Affiche un message d'erreur en cas d'échec */}
        {error && <p>{error}</p>}

        {/* Affiche les utilisateurs */}
        {users && !loading &&
          users.map((user) => (
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
          ))
        }

        {/* Formulaire d'ajout d'utilisateur */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name"
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Telephone"
            onChange={(e) => setTelephone(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Address"
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          {/* Champs dynamiques pour les hobbies */}
          <input
            type="text"
            placeholder="Hobby"
            value={newHobby} 
            onChange={(e) => setNewHobby(e.target.value)} 
          />
          <button type="button" onClick={handleAddHobby}>Ajouter un hobby</button>

          <div>
            <h4>Hobbies ajoutés :</h4>
            <ul>
              {hobbies.map((hobby, index) => (
                <li key={index}>{hobby}</li> // Affiche chaque hobby ajouté
              ))}
            </ul>
          </div>

          <input type="submit" value="Ajouter l'utilisateur" />
        </form>

        {/* Affichage du message de confirmation */}
        {confirmationMessage && <p>{confirmationMessage}</p>}
      </div>
    </>
  );
};

export default App;
