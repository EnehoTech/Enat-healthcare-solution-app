import { Link } from 'react-router';

const UnauthorizedPage = () => {
  return (
    <>
      <section className="container unauthorized-section my-5 pt-5">
        <h1 className="my-4">{`:( 403 - Unauthorized.`}</h1>
        <p>You don’t have permission to access this page.</p>
        <p className="mb-4">
          {" "}
          Go back to the home page or use an account with the correct
          permissions.
        </p>
        <div className="main-btn">
          <Link to="/">Back To Home</Link>
        </div>
      </section>
    </>
  );
}

export default UnauthorizedPage