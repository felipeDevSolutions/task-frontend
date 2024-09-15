import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { AuthContext } from '../../context/AuthContext';
import './Home.css';
import Alerts, { showSuccessToast, showErrorToast } from '../../components/layout/Alerts';
import { FaPen, FaCheck, FaTrash } from 'react-icons/fa'; // Importe os ícones

function Home() {
  const { currentUser, isLoading, error } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingProjectName, setEditingProjectName] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/projects', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error('Erro ao carregar projetos:', err);
        showErrorToast('Erro ao carregar projetos!');
      }
    };

    fetchProjects();
  }, []);

  const handleNewProjectChange = (event) => {
    setNewProject(event.target.value);
  };

  const handleAddProject = async (event) => {
    event.preventDefault();
    if (newProject.trim() !== '') {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/projects', {
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
          setNewProject('');
          showSuccessToast('Projeto adicionado!');
        } else {
          showErrorToast('Erro ao adicionar projeto!');
        }
      } catch (err) {
        console.error('Erro ao adicionar projeto:', err);
        showErrorToast('Erro ao adicionar projeto!');
      }
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setProjects(projects.filter((project) => project.id !== projectId));
        showSuccessToast('Projeto deletado!');
      } else {
        showErrorToast('Erro ao deletar projeto!');
      }
    } catch (err) {
      console.error('Erro ao deletar projeto:', err);
      showErrorToast('Erro ao deletar projeto!');
    }
  };

  const handleToggleProjectComplete = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}/complete`, {
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
        showSuccessToast('Status do projeto atualizado!');
      } else {
        showErrorToast('Erro ao atualizar projeto!');
      }
    } catch (err) {
      console.error('Erro ao atualizar projeto:', err);
      showErrorToast('Erro ao atualizar projeto!');
    }
  };

  const handleShowCompleted = () => {
    setShowCompleted(!showCompleted);
  };

  const handleEditProject = (projectId, projectName) => {
    setEditingProjectId(projectId);
    setEditingProjectName(projectName);
  };

  const handleSaveProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/projects/${editingProjectId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project: editingProjectName }),
      });

      if (response.ok) {
        setProjects(projects.map((project) =>
          project.id === editingProjectId ? { ...project, project: editingProjectName } : project
        ));
        setEditingProjectId(null);
        setEditingProjectName('');
        showSuccessToast('Nome do projeto atualizado com sucesso!');
      } else {
        showErrorToast('Erro ao atualizar o nome do projeto!');
      }
    } catch (err) {
      console.error('Erro ao atualizar o nome do projeto:', err);
      showErrorToast('Erro ao atualizar o nome do projeto!');
    }
  };

  const handleCancelEdit = () => {
    setEditingProjectId(null);
    setEditingProjectName('');
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
              onChange={handleNewProjectChange}
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
              <button
                className={`toggle-completed-button btn ${showCompleted ? 'btn-orange' : 'btn-green'}`}
                onClick={handleShowCompleted}
              >
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
                    <li
                      key={project.id}
                      className="list-group-item project-item d-flex justify-content-between align-items-center"
                    >
                      {editingProjectId === project.id ? (
                        <div className="edit-project-form">
                          <input
                            type="text"
                            value={editingProjectName}
                            onChange={(e) => setEditingProjectName(e.target.value)}
                          />
                          <button onClick={handleSaveProject}>Salvar</button>
                          <button onClick={handleCancelEdit}>Cancelar</button>
                        </div>
                      ) : (
                        <>
                          <Link to={`/project/${project.id}`}>
                            <span className="project-name">{project.project}</span>
                          </Link>
                          <div className="project-actions"> {/* Nova div para os botões */}
                            <button
                              className="btn btn-action btn-success"
                              onClick={(e) => {
                                e.preventDefault();
                                handleToggleProjectComplete(project.id);
                              }}
                              title={project.completed ? 'Desmarcar' : 'Concluir'} // Título para o tooltip
                            >
                              <FaCheck /> {/* Ícone de check */}
                            </button>
                            <button
                              className="btn btn-action btn-warning"
                              onClick={(e) => {
                                e.preventDefault();
                                handleEditProject(project.id, project.project);
                              }}
                              title="Editar" // Título para o tooltip
                            >
                              <FaPen /> {/* Ícone de edição */}
                            </button>
                            <button
                              className="btn btn-action btn-danger"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDeleteProject(project.id);
                              }}
                              title="Excluir" // Título para o tooltip
                            >
                              <FaTrash /> {/* Ícone de lixeira */}
                            </button>
                          </div>
                        </>
                      )}
                    </li>
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