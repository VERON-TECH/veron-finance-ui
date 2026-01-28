import { RouterProvider } from "react-router"
import { router } from "./router/router"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./utils/http"

function App() {
  return <QueryClientProvider client={queryClient}>
    <RouterProvider router={router}>
    </RouterProvider>
  </QueryClientProvider>
}

export default App
