import { Routes, Route } from "react-router-dom";

import Splash from "./pages/Splash/Splash";
import ListPage from "./pages/ListPage/ListPage";
import MapPage from "./pages/MapPage/MapPage";
import PageLayout from "./Layouts/PageLayout";

const App = () => {
  return (
    <>
      <PageLayout>
        <>
          <Routes>
            <Route
              path="wikiloc/"
              element={<Splash />}
            />
            <Route
              path="wikiloc/list"
              element={<ListPage />}
            />
            <Route
              path="wikiloc/map"
              element={<MapPage />}
            />
          </Routes>
        </>
      </PageLayout>
    </>
  );
};
export default App;
