import './App.css';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {EditorRoute, EditorRoutePath} from "./editor/EditorRoute";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path={""} element={<Navigate to={EditorRoutePath}></Navigate>}></Route>
                    <Route path={EditorRoutePath} element={<EditorRoute/>}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;

