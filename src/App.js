import { Suspense } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./routes";
import { store } from "./store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Box } from "@mui/material";
import useWindowSize from "./utils/hook/useWindowSize";
import { AuthProvider } from "./context/authContext";



function App() {
  const { width } = useWindowSize();
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={<div></div>}>
          <GoogleOAuthProvider
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          >
            <Box marginBottom={width <= 600 && "60px"}>
              <AuthProvider>
                <Routes>
                  {routes.map((route, index) => (
                    <Route key={index} {...route}>
                      {route.routes?.map((route, index) => (
                        <Route key={index} {...route} />
                      ))}
                    </Route>
                  ))}

                </Routes>
              </AuthProvider>
            </Box>
          </GoogleOAuthProvider>
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
