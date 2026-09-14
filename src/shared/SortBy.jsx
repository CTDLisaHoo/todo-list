//shared/SortBy.jsx

import styles from './SortBy.module.css';

function SortBy({
  sortBy,
  sortDirection,
  onSortByChange,
  onSortDirectionChange,
}) {
  return (
    <div className={styles.sortBy}>
      <div className={styles.field}>
        <label htmlFor="sortBy">Sort by</label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
        >
          <option value="createdAt">Created At</option>
          <option value="title">Title</option>
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="sortDirection">Order</label>
        <select
          id="sortDirection"
          value={sortDirection}
          onChange={(e) => onSortDirectionChange(e.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>
  );
}

export default SortBy;
