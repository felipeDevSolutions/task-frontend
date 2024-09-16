import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import './Project.css';
import Alerts, { showSuccessToast, showErrorToast } from '../../components/layout/Alerts';
import { FaPen, FaPalette, FaTrash, FaCheckCircle, FaCircle } from 'react-icons/fa';

const Project = () => {
  const { projectId } = useParams();
  const [sections, setSections] = useState([]);
  const [newSectionName, setNewSectionName] = useState('');
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingSectionName, setEditingSectionName] = useState('');
  const addSectionFormRef = useRef(null);

  const colors = ['#ffffffd5', '#f28b82', '#fbbc04', '#fff475', '#ccff90', '#a7ffeb', '#cbf0f8', '#aecbfa', '#d7aefb', '#fdcfe8', '#e6c9a8', '#e8eaed'];

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://task-backend-3crz.onrender.com/api/projects/${projectId}`, {
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
        const response = await fetch(`https://task-backend-3crz.onrender.com/api/projects/${projectId}/sections`, {
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
        const response = await fetch(`https://task-backend-3crz.onrender.com/api/projects/${projectId}/sections`, {
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
        `https://task-backend-3crz.onrender.com/api/projects/${projectId}/sections/${sectionId}`,
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

  const handleEditSection = (sectionId, sectionName) => {
    setEditingSectionId(sectionId);
    setEditingSectionName(sectionName);
  };

  const handleSaveSection = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://task-backend-3crz.onrender.com/api/projects/${projectId}/sections/${editingSectionId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editingSectionName }),
      });

      if (response.ok) {
        setSections(sections.map((section) =>
          section.id === editingSectionId ? { ...section, name: editingSectionName } : section
        ));
        setEditingSectionId(null);
        setEditingSectionName('');
        showSuccessToast('Nome da seção atualizado com sucesso!');
      } else {
        showErrorToast('Erro ao atualizar o nome da seção!');
      }
    } catch (err) {
      console.error('Erro ao atualizar o nome da seção:', err);
      showErrorToast('Erro ao atualizar o nome da seção!');
    }
  };

  const handleCancelEdit = () => {
    setEditingSectionId(null);
    setEditingSectionName('');
  };

  const handleSaveColor = async (sectionId, newColor) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://task-backend-3crz.onrender.com/api/projects/${projectId}/sections/${sectionId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ color: newColor }),
      });

      if (response.ok) {
        setSections(sections.map((section) =>
          section.id === sectionId ? { ...section, color: newColor } : section
        ));
        showSuccessToast('Cor da seção atualizada com sucesso!');
      } else {
        showErrorToast('Erro ao atualizar a cor da seção!');
      }
    } catch (err) {
      console.error('Erro ao atualizar a cor da seção:', err);
      showErrorToast('Erro ao atualizar a cor da seção!');
    }
  };

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
              onEdit={handleEditSection}
              onSave={handleSaveSection}
              onCancel={handleCancelEdit}
              editingSectionId={editingSectionId}
              editingSectionName={editingSectionName}
              setEditingSectionName={setEditingSectionName}
              setEditingSectionId={setEditingSectionId}
              colors={colors}
              handleSaveColor={handleSaveColor}
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

const SectionColumn = ({
  section,
  onDelete,
  projectId,
  onEdit,
  onSave,
  onCancel,
  editingSectionId,
  editingSectionName,
  setEditingSectionName,
  setEditingSectionId,
  colors,
  handleSaveColor,
}) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [editingSectionColor, setEditingSectionColor] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');

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
          `https://task-backend-3crz.onrender.com/api/projects/${projectId}/sections/${section.id}/tasks`,
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
          `https://task-backend-3crz.onrender.com/api/projects/${projectId}/sections/${section.id}/tasks`,
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

  const handleEditTask = (taskId, taskTitle) => {
    setEditingTaskId(taskId);
    setEditingTaskTitle(taskTitle);
  };

  const handleSaveTask = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://task-backend-3crz.onrender.com/api/projects/${projectId}/sections/${section.id}/tasks/${editingTaskId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: editingTaskTitle }),
        }
      );

      if (response.ok) {
        setTasks(tasks.map((task) =>
          task.id === editingTaskId ? { ...task, title: editingTaskTitle } : task
        ));
        setEditingTaskId(null);
        setEditingTaskTitle('');
        showSuccessToast('Tarefa atualizada com sucesso!');
      } else {
        showErrorToast('Erro ao atualizar a tarefa!');
      }
    } catch (err) {
      console.error('Erro ao atualizar a tarefa:', err);
      showErrorToast('Erro ao atualizar a tarefa!');
    }
  };

  const handleCancelTaskEdit = () => {
    setEditingTaskId(null);
    setEditingTaskTitle('');
  };

  const handleToggleTaskComplete = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const userId = currentUser ? currentUser.id : null; 

      if (!userId) {
        console.error('Usuário não autenticado!');
        return;
      }

      const response = await fetch(
        `https://task-backend-3crz.onrender.com/api/projects/${projectId}/sections/${section.id}/tasks/${taskId}/complete`,
        {
          method: 'PUT', 
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setTasks(tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
        showSuccessToast('Status da tarefa atualizado!');
      } else {
        showErrorToast('Erro ao atualizar o status da tarefa!');
      }
    } catch (err) {
      console.error('Erro ao atualizar o status da tarefa:', err);
      showErrorToast('Erro ao atualizar o status da tarefa!');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://task-backend-3crz.onrender.com/api/projects/${projectId}/sections/${section.id}/tasks/${taskId}`,
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
      <div className={`section-header ${editingSectionId === section.id ? 'editing' : ''}`} style={{ backgroundColor: section.color }}>
        {editingSectionId === section.id ? ( 
          <div className="edit-section-container">
            <input
              className="edit-section-input"
              type="text"
              value={editingSectionName}
              onChange={(e) => setEditingSectionName(e.target.value)}
            />
            <div className="edit-actions-container">
              <div className="edit-section-buttons">
                <button onClick={onSave}>Salvar</button>
                <button onClick={onCancel}>Cancelar</button>
              </div>
              <div className="section-actions"> 
                <button
                  className="btn btn-action"
                  style={{ borderColor: '#FFC107' }}
                  onClick={(e) => {
                    e.preventDefault();
                    setEditingSectionColor(
                      editingSectionColor === section.id ? null : section.id
                    );
                    setShowColorPicker(!showColorPicker);
                  }}
                  title="Escolher Cor"
                >
                  <FaPalette />
                </button>
                <button
                  className="btn btn-action btn-danger"
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete(section.id);
                  }}
                  title="Excluir"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <> 
            <div className="section-header-title">
              <h2>{section.name}</h2>
              <div className="section-actions">
                <button
                  className="btn btn-action btn-warning"
                  onClick={(e) => {
                    e.preventDefault();
                    onEdit(section.id, section.name);
                  }}
                  title="Editar"
                >
                  <FaPen />
                </button>
                <button
                  className="btn btn-action"
                  style={{ borderColor: '#FFC107' }}
                  onClick={(e) => {
                    e.preventDefault();
                    setEditingSectionColor(
                      editingSectionColor === section.id ? null : section.id
                    );
                    setShowColorPicker(!showColorPicker);
                  }}
                  title="Escolher Cor"
                >
                  <FaPalette />
                </button>
                <button
                  className="btn btn-action btn-danger"
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete(section.id);
                  }}
                  title="Excluir"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </>
        )}

        {showColorPicker && editingSectionColor === section.id && (
          <div className="color-picker">
            {colors.map((color) => (
              <div
                key={color}
                className="color-box"
                style={{ backgroundColor: color }}
                onClick={() => {
                  handleSaveColor(section.id, color);
                  setShowColorPicker(false);
                  setEditingSectionColor(null);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="tasks-container">
        <div className="tasks-list">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              {/* Exibe o ícone de tarefa concluída/pendente */}
              {editingTaskId === task.id ? (
                <div className="edit-task-form">
                  <input
                    type="text"
                    value={editingTaskTitle}
                    onChange={(e) => setEditingTaskTitle(e.target.value)}
                  />
                  <div className="edit-task-buttons"> {/* div para os botões */}
                    <button onClick={handleSaveTask}>Salvar</button>
                    <button onClick={handleCancelTaskEdit}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <>
                  <span className={task.completed ? 'task-completed' : ''}>{task.title}</span>
                  <div className="task-actions">
                    <button
                      className="btn btn-action btn-success"
                      onClick={(e) => {
                        e.preventDefault();
                        handleToggleTaskComplete(task.id);
                      }}
                      title={task.completed ? 'Marcar como Pendente' : 'Marcar como Concluída'}
                    >
                      {task.completed ? <FaCheckCircle /> : <FaCircle />} 
                    </button>
                    <button
                      className="btn btn-action btn-warning"
                      onClick={(e) => {
                        e.preventDefault();
                        handleEditTask(task.id, task.title);
                      }}
                      title="Editar Tarefa"
                    >
                      <FaPen />
                    </button>
                    <button
                      className="btn btn-action btn-danger"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteTask(task.id);
                      }}
                      title="Excluir Tarefa"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </>
              )}
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