import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import './Project.css';
import Alerts, { showSuccessToast, showErrorToast } from '../../components/layout/Alerts';

const Project = () => {
  const { projectId } = useParams();
  const [sections, setSections] = useState([]);
  const [newSectionName, setNewSectionName] = useState('');
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [projectName, setProjectName] = useState('');
  const addSectionFormRef = useRef(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://mytask-ze7d.onrender.com/api/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const projectData = await response.json();
          setProjectName(projectData.project);
        } else {
          console.error('Erro ao buscar dados do projeto.');
          showErrorToast('Erro ao buscar dados do projeto.');
        }
      } catch (err) {
        console.error('Erro ao buscar dados do projeto:', err);
        showErrorToast('Erro ao buscar dados do projeto.');
      }
    };

    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://mytask-ze7d.onrender.com/api/projects/${projectId}/sections`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSections(data);
        } else {
          console.error('Erro ao carregar seções.');
          showErrorToast('Erro ao carregar seções.');
        }
      } catch (err) {
        console.error('Erro ao carregar seções:', err);
        showErrorToast('Erro ao carregar seções.');
      }
    };

    if (projectId) {
      fetchSections();
    }
  }, [projectId]);

  const handleAddSection = async () => {
    if (newSectionName.trim() !== '') {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://mytask-ze7d.onrender.com/api/projects/${projectId}/sections`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newSectionName }),
        });

        if (response.ok) {
          const newSection = await response.json();
          setSections([...sections, newSection]);
          setNewSectionName('');
          setIsAddingSection(false);
          showSuccessToast('Seção adicionada com sucesso!');
        } else {
          console.error('Erro ao adicionar seção.');
          showErrorToast('Erro ao adicionar seção.');
        }
      } catch (err) {
        console.error('Erro ao adicionar seção:', err);
        showErrorToast('Erro ao adicionar seção.');
      }
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://mytask-ze7d.onrender.com/api/projects/${projectId}/sections/${sectionId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSections(sections.filter((section) => section.id !== sectionId));
        showSuccessToast('Seção excluída com sucesso!');
      } else {
        console.error('Erro ao excluir seção.');
        showErrorToast('Erro ao excluir seção.');
      }
    } catch (err) {
      console.error('Erro ao excluir seção:', err);
      showErrorToast('Erro ao excluir seção.');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        addSectionFormRef.current &&
        !addSectionFormRef.current.contains(event.target) &&
        !event.target.classList.contains('add-section-input') &&
        !event.target.classList.contains('add-section-button-salvar')
      ) {
        setIsAddingSection(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [addSectionFormRef]);

  return (
    <Layout>
      <Alerts />
      <div className="project-container">
        <h1>{projectName}</h1>

        <div className="sections-container" ref={addSectionFormRef}>
          {sections.map((section) => (
            <SectionColumn
              key={section.id}
              section={section}
              onDelete={handleDeleteSection}
              projectId={projectId}
            />
          ))}

          {!isAddingSection ? (
            <button className="add-section-button" onClick={() => setIsAddingSection(true)}>
              Adicionar lista
            </button>
          ) : (
            <div className="add-section-form animate-slide-in">
              <input
                type="text"
                placeholder="Nome da lista"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                className="add-section-input"
                ref={addSectionFormRef}
              />
              <div className="add-section-buttons">
                <button className="add-section-button-salvar" ref={addSectionFormRef} onClick={handleAddSection}>
                  Salvar
                </button>
                <button ref={addSectionFormRef} onClick={() => setIsAddingSection(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const SectionColumn = ({ section, onDelete, projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = currentUser ? currentUser.id : null;

        if (!userId) {
          console.error('Usuário não autenticado!');
          return;
        }

        const response = await fetch(
          `https://mytask-ze7d.onrender.com/api/projects/${projectId}/sections/${section.id}/tasks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error('Erro ao carregar tarefas.');
          showErrorToast('Erro ao carregar tarefas.');
        }
      } catch (err) {
        console.error('Erro ao carregar tarefas:', err);
        showErrorToast('Erro ao carregar tarefas.');
      }
    };

    fetchTasks();
  }, [projectId, section.id, currentUser]);

  const handleAddTask = async () => {
    if (newTaskTitle.trim() !== '') {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `https://mytask-ze7d.onrender.com/api/projects/${projectId}/sections/${section.id}/tasks`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: newTaskTitle }),
          }
        );

        if (response.ok) {
          const newTask = await response.json();
          setTasks([...tasks, newTask]);
          setNewTaskTitle('');
          setIsAddingTask(false);
          showSuccessToast('Tarefa adicionada com sucesso!');
        } else {
          console.error('Erro ao adicionar tarefa.');
          showErrorToast('Erro ao adicionar tarefa.');
        }
      } catch (err) {
        console.error('Erro ao adicionar tarefa:', err);
        showErrorToast('Erro ao adicionar tarefa.');
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://mytask-ze7d.onrender.com/api/projects/${projectId}/sections/${section.id}/tasks/${taskId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== taskId));
        showSuccessToast('Tarefa excluída com sucesso!');
      } else {
        console.error('Erro ao excluir tarefa.');
        showErrorToast('Erro ao excluir tarefa.');
      }
    } catch (err) {
      console.error('Erro ao excluir tarefa:', err);
      showErrorToast('Erro ao excluir tarefa.');
    }
  };

  return (
    <div className="section-column">
      <div className="section-header">
        <h2>{section.name}</h2>
        <button onClick={() => onDelete(section.id)}>Excluir Seção</button>
      </div>
      <div className="tasks-container">
        <div className="tasks-list">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              {task.title}
              <button onClick={() => handleDeleteTask(task.id)}>Excluir</button>
            </div>
          ))}
        </div>
        {!isAddingTask && (
          <button className="add-task-button" onClick={() => setIsAddingTask(true)}>
            + Adicionar Tarefa
          </button>
        )}
        {isAddingTask && (
          <div className="add-task-form">
            <input
              type="text"
              placeholder="Título da Tarefa"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <div className="add-task-buttons">
              <button onClick={handleAddTask}>Salvar</button>
              <button onClick={() => setIsAddingTask(false)}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Project;