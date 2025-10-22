
import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <>
      <section className="container not-found-page-section my-5">
        <h1 className="my-4">{`:( 404: Page not found.`}</h1>
        <p>
          Oops! The page you're looking for was not found or has been removed.
        </p>
        <p className="mb-4"> Go back to home</p>
        <div className="main-btn">
          <Link to="/">Home</Link>
        </div>
      </section>
    </>
  );
};

export default NotFoundPage;
