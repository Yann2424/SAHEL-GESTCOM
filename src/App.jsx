import Dash from './Vue/Administrateur/Dash'
import { AppProvider } from "./Vue/Administrateur/AppProvider";


import Connexion from './Modules/Auth/Connexion'

function App (){

  return(
    <>
      <AppProvider>
      <Dash />
    </AppProvider>
      
    </>
  )
}
export default App
