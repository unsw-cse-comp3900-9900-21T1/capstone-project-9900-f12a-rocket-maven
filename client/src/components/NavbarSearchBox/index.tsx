import { urls } from '@rocketmaven/data/urls'
import { Button, Input } from 'antd'
import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useHistory } from 'react-router'

const NavbarSearchBox = (props: any) => {
  const [search, setSearch] = useState<string>('')
  const routerObject = useHistory()

  const startSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // https://stackoverflow.com/questions/59464337/how-to-send-params-in-usehistory-of-react-router-dom
    routerObject.push({
      pathname: urls.advancedSearch,
      search: `?q=${search}`,
      state: {
        // location state
        update: true
      }
    })
  }

  return (
    <form onSubmit={startSearch} style={{ display: 'inline' }}>
      <Input
        placeholder="Search Asset"
        {...props}
        onChange={(search: React.ChangeEvent<HTMLInputElement>) => {
          setSearch(search.target.value)
        }}
      />
      <Button
        style={{
          marginLeft: '0.5rem',
          marginRight: '0.5rem'
        }}
        htmlType="submit"
      >
        <FaSearch />
      </Button>
    </form>
  )
}

export default NavbarSearchBox
