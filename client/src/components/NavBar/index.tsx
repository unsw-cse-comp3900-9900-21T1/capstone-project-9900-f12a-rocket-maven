import { useContext } from 'react'
import { storeContext } from '../../data/store'
import { Text, Subtitle } from '../../componentsStyled/Typography'

const NavBar = () => {
  const { state } = useContext(storeContext)
  const { isLoggedIn } = state

  return (
    <div>
      <Text>
        Navbar Stub. Testing logged in state. Logged in state is
        <div>
          <strong>{isLoggedIn ? 'true' : 'false'}</strong>
        </div>
      </Text>
    </div>
  )
}

export default NavBar;
