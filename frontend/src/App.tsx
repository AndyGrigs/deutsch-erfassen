import { Router, Route, BrowserRouter } from "react-router-dom";
import "./App.css";

/**  {/* <Router>
      <Switch>
        <Route path="/register" component={RegisterForm} />
        <Route path="/update-code" component={UpdateCodeForm} />
        <Route path="/login" component={LoginForm} />
        <Route path="/profile" component={UserProfile} />
        {/* Add more routes as needed 
      </Switch> </Router>  */

function App() {
  return (
    <>
      <main>
        <BrowserRouter>
          <Router>
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/About" element={<About />}></Route>
              <Route path="*" element={<NotFound />}></Route>
            </Routes>
          </Router>
        </BrowserRouter>
      </main>
    </>
  );
}

export default App;
