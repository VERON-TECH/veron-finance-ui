import { PrimeReactProvider } from "primereact/api";
import { RouterProvider } from "react-router-dom";
import router from "./router/router";
import { QueryClient } from "@tanstack/react-query";
import queryClient from "./utils/http";

function App() {

  return (
    <PrimeReactProvider value={{ unstyled: true }}>
      <RouterProvider router={router}>
        <QueryClient client={queryClient}>

        </QueryClient>
      </RouterProvider>
    </PrimeReactProvider>
  )
}

export default App
