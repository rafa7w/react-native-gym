import { UserDTO } from "@dtos/UserDTO"
import { ReactNode, createContext } from "react"

export type AuthContextDataProps = {
  user: UserDTO;
}

export type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

export function AuthContextoProvider({children}: AuthContextProviderProps) {
  return (
    <AuthContext.Provider value={{
      user: {
        id: '1',
        name: 'Rodrigo',
        email: 'rodrigo@email.com',
        avatar: 'rodrigo.png'
      }
    }}>
      { children }
    </AuthContext.Provider>
  )
}