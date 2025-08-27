import Dash from './Vue/Dash'
import { AppProvider } from "./Vue/AppContext";


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
