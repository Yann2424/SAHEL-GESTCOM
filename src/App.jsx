import { useState } from 'react'
<<<<<<< HEAD
import Connexion from './user/Connexion'
=======
import { FaTwitter, FaGoogle, FaApple } from 'react-icons/fa';
import './App.css'
>>>>>>> 8bfeb56cb5ceecd22b81c92c311ebb103cfba7f2

function App() {
const [isSignIn, setIsSignIn] = useState(true);

  return (
<<<<<<< HEAD
    <>
      <Connexion/>
    </>
=======
    <div className="container">
      <h1>Bienvenu !</h1>
      <form className="form">
        {!isSignIn && (
          <>
            <div className="form-group">
              <label htmlFor="firstName">Nom</label>
              <input type="text" id="firstName" placeholder="Entrez votre nom" />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Prénom</label>
              <input type="text" id="lastName" placeholder="Entrez votre prénom" />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Numéro de téléphone</label>
              <input type="tel" id="phone" placeholder="Entrez votre numéro de téléphone" />
            </div>
          </>
        )}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Entrez votre email" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input type="password" id="password" placeholder="Entrez votre mot de passe" />
          <a href="#" className="forgot-password">Mot de passe oublié ?</a>
        </div>
        <button className="btn">{isSignIn ? 'Sign In' : 'Sign Up'}</button>
        <div className="social-login">
          <p>Connectez vous avec</p>
          <button className="social-btn"><FaTwitter /> Twitter</button>
          <button className="social-btn"><FaGoogle /> Google</button>
          <button className="social-btn"><FaApple /> Apple</button>
        </div>
      </form>
      <button className="toggle-btn" onClick={() => setIsSignIn(!isSignIn)}>
        {isSignIn ? 'Créer un compte' : 'Avez-vous déjà un compte ? Se connecter'}
      </button>
    </div>
  );
};
>>>>>>> 8bfeb56cb5ceecd22b81c92c311ebb103cfba7f2
  )
}

export default App
