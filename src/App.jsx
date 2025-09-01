import Dash from './Vue/Administrateur/Dash'
import { AppProvider } from "./Vue/Administrateur/AppProvider";
import DashbordResponsable from "../../SAHEL-GESTCOM/src/Vue/Responsable/DashbordResponsable";

function App (){

  return(
    <>
      <AppProvider>
      <Dash />
    </AppProvider>
    
     {/* <DashbordResponsable /> */}
    </>
  )
}
export default App
