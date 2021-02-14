import React, {useState, useEffect, FormEvent} from 'react';
import {Link} from 'react-router-dom';
import {Title, Form, Repositories, Error} from './styles';
import logoImg from '../../assets/1587379765556-attachment.svg';
import {FiChevronRight} from 'react-icons/fi';
import api from '../../services/api';

interface Repository{
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    };
}
 
const Dashboard: React.FC = ()=>{
    const [newRepo, setNewRepo] = useState('');
    const [repositories, setRepositories] = useState<Repository[]>(()=>{
        const storagedRepositories = localStorage.getItem('@github-explorer:repositories');

        if (storagedRepositories){
            return JSON.parse(storagedRepositories);
        }else{
            return [];
        }
    });

    const [inputError, setInputError] = useState('');

    useEffect(()=> {
        localStorage.setItem('@github-explorer:repositories', JSON.stringify(repositories));

    }, [repositories]);

    async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void>{
        event.preventDefault();
        if (!newRepo){
            setInputError('Digite autor/nome do repositório');
            return;
        }
        
        try{
            const response = await api.get<Repository>(`repos/${newRepo}`)

            const repository = response.data;

            setRepositories([...repositories, repository]);
            setInputError('');
            setNewRepo('');
        }
        catch(err){
            setInputError('Erro na busca pelo repositório');
        }
    }

    return (
        <>
            <img src={logoImg} alt="Github Explorer"/>
            <Title>Explore repositórios do Github</Title>

            <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                    <input type="text" placeholder="Digite aqui"
                        value={newRepo}
                        onChange={(e)=>setNewRepo(e.target.value)}
                    />
                    <button type="submit">Pequisar</button>
            </Form>

            {inputError &&<Error>{inputError}</Error>}

            <Repositories>
                {repositories.map(repository=>(
                    <Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>
                            <img src={repository.owner.avatar_url} alt={repository.owner.login}/>
                            <div>
                                <strong>{repository.full_name}</strong>
                                <p>{repository.description}</p>
                            </div>
                            <FiChevronRight size={20}/>
                    </Link>
                ))}
            </Repositories>
        </>
    );
};

export default Dashboard;