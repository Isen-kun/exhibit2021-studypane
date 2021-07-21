import { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/css/landing.css";

const Landing = () => {
  const { signup, signInWIthGoogle, currentUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [rePass, setRePass] = useState("");
  const [loading, setLoading] = useState(false);
  const [signError, setSignError] = useState(false);
  const [passError, setPassError] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    setEmail("");
    setPass("");
    setRePass("");
    if (pass !== rePass) {
      setPassError(true);
      return;
    } else {
      try {
        setPassError(false);
        setSignError(false);
        setLoading(true);
        await signup(email, pass);
      } catch {
        setSignError(true);
        setLoading(false);
        return;
      }
    }
    setLoading(false);

    if (!passError && !signError) {
      history.push("/Dashboard");
    }
  }

  useEffect(() => {
    if (currentUser) {
      history.push("/Dashboard");
    }
  });

  return (
    <>
      <div className="container">
        <div className="welcome">
          <h1 className="wtitle"> Welcome to Study<span className="wtitle2">Pane</span></h1>
          <h2>An application built for simulating study groups conducive to learning and being productive.</h2>
          <p>
            <Link to="/Offhome" className="demobttn">Try Demo</Link>
          </p>
          
        </div>
        <div className="signupbox">
          <p className="signupheader">Sign up</p>
          {signError && (
            <div>
              Sorry we faced an error creating your account please try again later
            </div>
          )}
          <form  className="signupform" onSubmit={handleSubmit}>
            <label htmlFor="femail">Email address</label>
            <input
              className="winput"
              type="email"
              name="femail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="fpass">Password</label>
            <input
              className="winput"
              type="password"
              name="fpass"
              required
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            {passError && <div>Passwords do not match.</div>}
            <label htmlFor="frepass">Repeat Password</label>
            <input
              className="winput"
              type="password"
              name="frepass"
              required
              value={rePass}
              onChange={(e) => setRePass(e.target.value)}
            />
            <div className="submitbttn">
              <input className="submitbttnstyle" type="submit" value="Submit" disabled={loading} />
            </div>
          </form>
          <p className="authbttn" onClick={signInWIthGoogle}>Sign in With Google</p>
          <p>
            Already have an account? <Link to="/Login">Login</Link>{" "}
          </p>
        </div>
       
      </div>
      <div className="wcredit">
          Developed by TernaryDevs
        </div>
    </>
  );
};

export default Landing;
