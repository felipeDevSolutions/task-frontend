import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { AuthContext } from '../../context/AuthContext';
import './Home.css';
import Alerts, { showSuccessToast, showErrorToast } from '../../components/layout/Alerts';

function Home() {
  const { currentUser, isLoading, error } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [newProject, setNewproject] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://task-backend-3crz.onrender.com/api/projects', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error('Erro ao carregar tarefas:', err);
        showErrorToast('Erro ao carregar tarefas!');
      }
    };
    fetchProjects();
  }, []);

  const handleNewprojectChange = (event) => {
    setNewproject(event.target.value);
  };

  const handleAddProject = async (event) => {
    event.preventDefault();
    if (newProject.trim() !== '') {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://task-backend-3crz.onrender.com/api/projects', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ project: newProject }),
        });
        if (response.ok) {
          const newProjectData = await response.json();
          setProjects([...projects, newProjectData]);
          setNewproject('');
          showSuccessToast('Tarefa adicionada!');
        } else {
          showErrorToast('Erro ao adicionar tarefa!');
        }
      } catch (err) {
        console.error('Erro ao adicionar tarefa:', err);
        showErrorToast('Erro ao adicionar tarefa!');
      }
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://task-backend-3crz.onrender.com/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setProjects(projects.filter((project) => project.id !== projectId));
        showSuccessToast('Tarefa deletada!');
      } else {
        showErrorToast('Erro ao deletar tarefa!');
      }
    } catch (err) {
      console.error('Erro ao deletar tarefa:', err);
      showErrorToast('Erro ao deletar tarefa!');
    }
  };

  const handleToggleProjectComplete = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://task-backend-3crz.onrender.com/api/projects/${projectId}/complete`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const updatedProjects = projects.map((project) =>
          project.id === projectId ? { ...project, completed: !project.completed } : project
        );
        setProjects(updatedProjects);
        showSuccessToast('Tarefa concluída!');
      } else {
        showErrorToast('Erro ao atualizar tarefa!');
      }
    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err);
      showErrorToast('Erro ao atualizar tarefa!');
    }
  };

  const handleShowCompleted = () => {
    setShowCompleted(!showCompleted);
  };

  return (
    <Layout>
      <Alerts />
      <div className="home-container">
        <div className="project-header">
          <div className="welcome-title">
            <h1>Gerenciador de Projetos</h1>
            {currentUser && <p>Bem-vindo, {currentUser.email}!</p>}
          </div>
          <div className="add-project-input">
            <input
              type="text"
              className="form-control"
              placeholder="Adicionar novo projeto"
              value={newProject}
              onChange={handleNewprojectChange}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && newProject.trim() !== '') {
                  event.preventDefault();
                  handleAddProject(event);
                }
              }}
            />
            <div className='btn-group-header'>
              <button className="btn btn-primary add-project-button" onClick={handleAddProject}>
                Adicionar
              </button>
              <button className={`toggle-completed-button btn ${showCompleted ? 'btn-orange' : 'btn-green'}`} onClick={handleShowCompleted}>
                {showCompleted ? 'Mostrar Pendentes' : 'Mostrar Concluídas'}
              </button>
            </div>
          </div>
        </div>

        <div className="project-list">
          <div className="col-12">
            {isLoading ? (
              <p>Carregando projetos...</p>
            ) : error ? (
              <p>Erro ao carregar projetos: {error.message}</p>
            ) : (
              <ul className="list-group">
                {projects
                  .filter((project) => (showCompleted ? project.completed : !project.completed))
                  .map((project) => (
                    <Link key={project.id} to={`/project/${project.id}`}>
                      <li className="list-group-item project-item d-flex justify-content-between align-items-center">
                        {project.project}
                        <div>
                          <button
                            className="btn btn-success btn-sm mr-2 project-done-button"
                            onClick={(e) => {
                              e.preventDefault(); // Impede a navegação ao clicar no botão "Fiz"
                              handleToggleProjectComplete(project.id);
                            }}
                          >
                            Fiz
                          </button>
                          <button
                            className="btn btn-danger btn-sm project-delete-button"
                            onClick={(e) => {
                              e.preventDefault(); // Impede a navegação ao clicar no botão "Excluir"
                              handleDeleteProject(project.id);
                            }}
                          >
                            Excluir
                          </button>
                        </div>
                      </li>
                    </Link>
                  ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;