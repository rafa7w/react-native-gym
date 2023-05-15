import { useTheme } from 'native-base'
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs'

import HomeSvg from '@assets/home.svg'
import HistorySvg from '@assets/history.svg'
import ProfileSvg from '@assets/profile.svg'

import { Home } from '@screens/Home'
import { Profile } from '@screens/Profile'
import { History } from '@screens/History'
import { Exercise } from '@screens/Exercise'

type AppRoutes = {
  home: undefined;
  exercise: undefined;
  profile: undefined;
  history: undefined;
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>()

export function AppRoutes() {
  const { sizes } = useTheme()
  const iconSizes = sizes[6]

  return (
    <Navigator screenOptions={{
      headerShown: false,
      tabBarShowLabel: false
    }}>
      <Screen 
        name='home'
        component={Home}
        options={{
          tabBarIcon: ({color}) => (
            <HomeSvg fill={color} width={iconSizes} height={iconSizes}/>
          )
        }}  
      />
      <Screen 
        name='history'
        component={History}
        options={{
          tabBarIcon: ({color}) => (
            <HistorySvg fill={color} width={iconSizes} height={iconSizes}/>
          )
        }} 
      />
      <Screen 
        name='profile'
        component={Profile}
        options={{
          tabBarIcon: ({color}) => (
            <ProfileSvg fill={color} width={iconSizes} height={iconSizes}/>
          )
        }} 
      />
      <Screen 
        name='exercise'
        component={Exercise}
      />
    </Navigator>
  )
}