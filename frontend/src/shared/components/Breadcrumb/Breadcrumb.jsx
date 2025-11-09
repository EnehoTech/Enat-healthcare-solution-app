import { Link } from 'react-router';
import styles from './Breadcrumb.module.css';
import { MdOutlineChevronRight } from 'react-icons/md';
const Breadcrumb = ({ items, uniqueStyle }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol
        className={`${styles["breadcrumb"]} ${
          uniqueStyle ? styles[uniqueStyle] : " "
        }`}
      >
        {items.map((item, index) => (
          <li
            key={index}
            className={`${styles["breadcrumb-item"]}  ${
              index === items.length - 1 ? styles["breadcrumb-active"] : ""
            }`}
          >
            {index !== items.length - 1 ? (
              <>
                {/* Icon in front of text */}
                <Link
                  className={styles["breadcrumb-link"]}
                  to={item.path}
                >
                  {item?.behindIcon && (
                    <span
                      className={`${styles["breadcrumb-behind-icon"]} me-2`}
                    >
                      {item.behindIcon}
                    </span>
                  )}

                  {item.label}
                </Link>
                <MdOutlineChevronRight
                  className={`${styles["breadcrumb-front-icon"]} ms-2`}
                />
              </>
            ) : (
              <>
                {item?.behindIcon && (
                  <span className={`${styles["breadcrumb-behind-icon"]} me-2`}>
                    {item.behindIcon}
                  </span>
                )}
                {/* Active breadcrumb item */}
                <span className={styles["breadcrumb-label"]}>{item.label}</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
