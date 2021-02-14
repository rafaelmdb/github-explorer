import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';
import GlobalSytle from './styles/global';

//function App() { //Outra forma de declarar a função, fica mais simples de tipar
/*const App: React.FC = ()=>{
    return <Routes/>;
}
*/
//Forma mais contracta
const App: React.FC = () => (
  <>
    <BrowserRouter>
      <Routes/>
    </BrowserRouter>
    <GlobalSytle/>
  </>
)
export default App;
