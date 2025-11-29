import React from 'react';
import PropTypes from 'prop-types';
import './PeriodSelector.css';

const PERIODOS = [
    { value: 'hoje', label: 'Hoje' },
    { value: 'semana', label: 'Esta Semana' },
    { value: 'mes', label: 'Este Mês' },
    { value: 'ano', label: 'Este Ano' },
    { value: 'todos', label: 'Todos' }
];

const PeriodSelector = ({ value, onChange }) => {
    return (
        <div className="period-selector">
            <label className="period-label">Período:</label>
            <div className="period-buttons">
                {PERIODOS.map(periodo => (
                    <button
                        key={periodo.value}
                        className={`period-button ${value === periodo.value ? 'active' : ''}`}
                        onClick={() => onChange(periodo.value)}
                        type="button"
                    >
                        {periodo.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

PeriodSelector.propTypes = {
    value: PropTypes.oneOf(['hoje', 'semana', 'mes', 'ano', 'todos']).isRequired,
    onChange: PropTypes.func.isRequired
};

export default PeriodSelector;