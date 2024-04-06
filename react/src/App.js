import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {EditorRoute} from "./components/editor/EditorRoute";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path={"/editor"} element={<EditorRoute/>}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
