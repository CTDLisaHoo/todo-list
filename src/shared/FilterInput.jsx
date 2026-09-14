//shared/FilterInput.jsx

import styles from './FilterInput.module.css';

function FilterInput({filterTerm ,onFilterChange}) {
  return(
    <div className={styles.filterInput}>
        <label htmlFor='filterInput'>Search todos:</label>
        <input
            id='filterInput'
            type='text'
            value={filterTerm}
            onChange={(e) => onFilterChange(e.target.value)}
            placeholder='Search by title...'
            maxLength={100}
        />
        {filterTerm.length >= 100 && (
          <p role="alert">Search cannot exceed 100 characters.</p>
      )}
    </div> 
  );
}

export default FilterInput;
