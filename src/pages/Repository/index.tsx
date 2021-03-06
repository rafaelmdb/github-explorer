import React, {useEffect, useState} from 'react';
import {useRouteMatch, Link, Redirect, Router, useHistory} from 'react-router-dom';
import {FiChevronLeft, FiChevronRight, FiTrash} from 'react-icons/fi';
import {Header, RepositoryInfo, Issues} from './styles';
import logoImg from '../../assets/1587379765556-attachment.svg';
import fotoPerfil from '../../assets/69557631.png';
import api from '../../services/api';
import Routes from '../../routes';

interface RepositoryParams{
    repository: string;
}

interface RepositoryData{
    full_name: string;
    description: string;

    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;

    owner: {
        login: string;
        avatar_url: string;
    }
}

interface Issue{
    id: number;
    title: string;
    html_url: string;
    user: {
        login: string;
    }
}

const Repository:React.FC = ()=>{
    const [repository, setRepository] = useState<RepositoryData | null>(null);
    const [issues, setIssues] = useState<Issue[]>([]);
    const {params} = useRouteMatch<RepositoryParams>();
    const history = useHistory();

    useEffect(()=>{
        api.get(`repos/${params.repository}`).then((response)=>{
            setRepository(response.data);
        });

        api.get(`repos/${params.repository}/issues`).then((response)=>{
            setIssues(response.data);
        });
        /*
        await faz o código esperar para depois ir para a próxima request.
        Quando eu quero chamar assíncrono mas as request serão feitas ao mesmo
        tempo porque uma não depende da outra eu posso fazer isso:
        async function loadData(){
            const [repository, issues] = await Promise.all([
                api.get(`repos/${params.repository}`),
                api.get(`repos/${params.repository}/issues`)
            ]);
        }

        loadData();*/

    }, [params.repository]);

    function handleRemoveRepository(full_name: string) {
        if (!confirm('Remover repositório?')){
            return;
        }

        const storagedRepositories = localStorage.getItem('@github-explorer:repositories');

        if (storagedRepositories){
            const repositories = JSON.parse(storagedRepositories);
            const newStoragedRepositories = repositories.filter((repo: { full_name: string; })=>repo.full_name!==full_name);
            localStorage.setItem('@github-explorer:repositories', JSON.stringify(newStoragedRepositories));
        }

        history.push('/');
    }

    return (
        <>
            <Header>
                <img src={logoImg} alt="Github Explorer"/>
                <Link to="/">
                    <FiChevronLeft size={16}/>
                    Voltar
                </Link>
            </Header>

            {repository ? (
                <RepositoryInfo>
                    <header>
                        <img src={repository.owner.avatar_url} alt={repository.owner.login}></img>
                        <div>
                            <strong>{repository.full_name}</strong><FiTrash onClick={()=>handleRemoveRepository(repository.full_name)}/>
                            <p>{repository.description}</p>
                        </div>
                    </header>
                    <ul>
                        <li>
                            <strong>{repository.stargazers_count}</strong>
                            <span>Stars</span>
                        </li>
                        <li>
                            <strong>{repository.forks_count}</strong>
                            <span>Forks</span>
                        </li>
                        <li>
                            <strong>{repository.open_issues_count}</strong>
                            <span>Issues</span>
                        </li>
                    </ul>
                   
                </RepositoryInfo>
            ): (<p>Carregando...</p>)}

            <Issues>
                {issues.map((issue=>(
                    <a key={issue.id} href={issue.html_url}>
                        <div>
                            <strong>{issue.title}</strong>
                            <p>{issue.user.login}</p>
                        </div>
                        <FiChevronRight  size={20}/>
                    </a>
                )))}
            </Issues>
        </>
    );
};

export default Repository;