import React from 'react';
import { Switch, Route} from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Repository from '../pages/Repository';

/*Quando tenho vários componentes posso usar apenas <>, mas se usaraqui nas rotas, o react mostra todas as rotas.*/
const Routes: React.FC = () =>(
        <Switch> 
            <Route path="/" exact component={Dashboard}/>
            <Route path="/repositories/:repository+" component={Repository}/>
        </Switch>
);

export default Routes;