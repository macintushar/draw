import { Excalidraw } from "@excalidraw/excalidraw";
import { NonDeletedExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import {
  AppState,
  ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types/types";
import { useEffect, useState } from "react";

function getLocalExcalidrawData() {
  const data = localStorage.getItem("draw-data");
  if (data !== null) {
    return data;
  } else {
    localStorage.setItem("draw-data", "");
  }
}

function setLocalExcalidrawData(
  elements: readonly NonDeletedExcalidrawElement[],
  appState: AppState
) {
  const sceneData = {
    elements: elements,
    appState: appState,
  };
  localStorage.setItem("draw-data", JSON.stringify(sceneData));
}

function App() {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI>();

  useEffect(() => {
    console.log(excalidrawAPI?.getSceneElements());
    const sceneData = {
      elements: excalidrawAPI?.getSceneElements(),
      appState: excalidrawAPI?.getAppState(),
    };
  }, [excalidrawAPI]);

  const updateScene = () => {
    const data = getLocalExcalidrawData();
    if (data) {
      const sceneData = JSON.parse(data);
      console.log(sceneData);

      // excalidrawAPI?.updateScene(sceneData);
    }
  };

  return (
    <main className="h-screen w-screen max-h-screen bg-gray-950">
      <div className="flex flex-col h-full">
        <div className="text-center">
          <h1 className="text-3xl text-white">Draw</h1>
        </div>
        <div className="text-white flex flex-row gap-8 w-full justify-center">
          <button
            onClick={() => {
              excalidrawAPI
                ? setLocalExcalidrawData(
                    excalidrawAPI.getSceneElements(),
                    excalidrawAPI.getAppState()
                  )
                : {};
            }}
          >
            Set Data
          </button>
          <button onClick={updateScene}>Get Data</button>
        </div>
        <div className="max-h-full h-full min-h-max">
          <Excalidraw
            theme="dark"
            excalidrawAPI={(api) => setExcalidrawAPI(api)}
          />
        </div>
      </div>
    </main>
  );
}

export default App;
