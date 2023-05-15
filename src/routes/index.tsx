import { useTheme, Box } from 'native-base'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { AuthRoutes } from './auth.routes'
import { AppRoutes } from './app.routes'

export function Routes() {
  const nativeBaseTheme = useTheme()

  const theme = DefaultTheme

  // pode desestruturar colors do useTheme também
  theme.colors.background = nativeBaseTheme.colors.gray[700]

  return (
    // para garantir que uma tela branca não apareça entre as transições de tela, envolvemos com uma box
    <Box flex={1} bg='gray.700'>
      <NavigationContainer theme={theme}>
        <AppRoutes />
      </NavigationContainer>
    </Box>
  )
}