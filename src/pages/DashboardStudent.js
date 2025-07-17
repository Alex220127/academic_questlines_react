import React, { useState, useEffect } from 'react';
import '../styles/QuestlineTrack.css';
import { getQuestlineReport } from '../serivces/api';
import { isConnected } from '../utils/isConnected';
import { useNavigate } from 'react-router';

const QuestlineTrack = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuestline, setSelectedQuestline] = useState('');
  const [expandedStudents, setExpandedStudents] = useState({});
  const navigate = useNavigate()

  useEffect(() => {
    const fetchEnrollments = async () => {
      setLoading(true);
        const response = await getQuestlineReport(localStorage.getItem('token'))

        if (response.success) {
          setEnrollments(response.data)
        } else {
          setError("Failed to load enrollment data.")
        }

        setLoading(false)
    };

    const connectedUser = isConnected()

    if (!connectedUser) {
      navigate('/login')
    }

    fetchEnrollments();
  }, [ navigate ]);

  const handleFilterChange = (e) => {
    setSelectedQuestline(e.target.value)
  };

  const toggleStudentExpansion = (questlineId) => {
    setExpandedStudents(prev => ({
      ...prev,
      [questlineId]: !prev[questlineId]
    }));
  };

  const filteredEnrollments = selectedQuestline
    ? enrollments.filter(enrollment => enrollment._id === selectedQuestline)
    : enrollments;

  if (loading) {
    return <div className="enrollment-message">Loading enrollment data...</div>;
  }

  if (error) {
    return <div className="enrollment-message error">{error}</div>;
  }

  const availableQuestlines = enrollments.map(ql => ({
    id: ql._id,
    name: ql.name
  }));

  return (
    <div className="enrollment-tracker-container">
      <h1 className="tracker-title">Acompanhamento de Matrículas em Trilhas</h1>

      <div className="filter-section">
        <label htmlFor="questline-filter">Filtrar por Trilha:</label>
        <select
          id="questline-filter"
          value={selectedQuestline}
          onChange={handleFilterChange}
        >
          <option value="">Todas as Trilhas</option>
          {availableQuestlines.map(ql => (
            <option key={ql.id} value={ql.id}>
              {ql.name}
            </option>
          ))}
        </select>
      </div>

      {filteredEnrollments.length === 0 && (
        <div className="enrollment-message">
          {selectedQuestline ? "Nenhum dado encontrado para a trilha selecionada." : "Nenhuma matrícula encontrada."}
        </div>
      )}

      <div className="enrollment-cards-grid">
        {filteredEnrollments.map((enrollment) => (
          <div key={enrollment._id} className="enrollment-card">
            <h2 className="card-questline-name">{enrollment.name}</h2>
            <p><strong>ID da Trilha:</strong> {enrollment._id}</p>
            <p><strong>Total de Alunos:</strong> <span className="stat-count">{enrollment.count}</span></p>
            <p><strong>Concluídos:</strong> <span className="stat-completed">{enrollment.completed}</span></p>
            <p><strong>Em Progresso:</strong> <span className="stat-in-progress">{enrollment.in_progress}</span></p>

            <button
              className="toggle-students-button"
              onClick={() => toggleStudentExpansion(enrollment._id)}
            >
              {expandedStudents[enrollment._id] ? 'Ocultar Detalhes dos Alunos' : 'Expandir Detalhes dos Alunos'}
            </button>

            {expandedStudents[enrollment._id] && (
              <div className="student-details-expanded">
                <h3>Alunos Matriculados:</h3>
                {enrollment.students.length > 0 ? (
                  <ul>
                    {enrollment.students.map(student => (
                      <li key={student._id} className="student-item">
                        <p><strong>Nome:</strong> {student.user_name}</p>
                        <p><strong>Email:</strong> {student.user_email}</p>
                        <p><strong>Status na Trilha:</strong> <span className={`student-status ${student.status}`}>{student.status.replace('_', ' ')}</span></p>

                        {/* Optionally show node progress here as well */}
                        <div className="student-node-progress">
                          <h4>Progresso dos Nós:</h4>
                          <ul>
                            {student.nodes.map((node, nodeIdx) => (
                              <li key={nodeIdx}>
                                {node.name} (<span className={`node-status ${node.status}`}>{node.status}</span>)
                              </li>
                            ))}
                          </ul>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Nenhum aluno matriculado nesta trilha.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestlineTrack;
