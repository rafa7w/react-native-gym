import { api } from "@services/api";
import { UserDTO } from "@dtos/UserDTO"
import { ReactNode, createContext, useState } from "react"

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (email: string, password: string) => Promise<void>;
}

export type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

export function AuthContextoProvider({children}: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)

  async function signIn(email: string, password: string) {
    try {
      const {data} = await api.post('/sessions', {email, password})
  
      if (data.user) {
        setUser(data.user)
      }
      
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, signIn }}>
      { children }
    </AuthContext.Provider>
  )
}