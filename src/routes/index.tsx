import { useTheme, Box } from 'native-base'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { AuthRoutes } from './auth.routes'
import { AppRoutes } from './app.routes'
import { useAuth } from '@hooks/useAuth'
import { Loading } from '@components/Loading'

export function Routes() {
  const nativeBaseTheme = useTheme()

  const { user, isLoadingUserStorageData } = useAuth()

  const theme = DefaultTheme

  // pode desestruturar colors do useTheme também
  theme.colors.background = nativeBaseTheme.colors.gray[700]

  if (isLoadingUserStorageData) {
    return <Loading />
  }

  return (
    // para garantir que uma tela branca não apareça entre as transições de tela, envolvemos com uma box
    <Box flex={1} bg='gray.700'>
      <NavigationContainer theme={theme}>
        {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  )
}