import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div
      className={`d-flex flex-column justify-content-center align-items-center vh-100`}
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/4923/4923785.png"
        alt="Error 404"
        className="img-fluid"
        style={{ maxWidth: "15%", height: "auto" }}
      />
      <h1 className="mt-4 fw-bold">Oops! Page Not Found</h1>
      <p className="lead text-center" style={{ maxWidth: "600px" }}>
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn btn-primary mt-3">
        Back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
