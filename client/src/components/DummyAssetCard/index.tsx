import { Text } from '../../componentsStyled/Typography'
import { useHistory } from 'react-router-dom'

type Props = {
  // Note(Jude): Should not be leaving as any, just aiming to get some CRUD routing pattern implemented
  asset: any
}

export const DummyAssetCard = ({asset}: Props) => {
  const entries = Object.entries(asset)
  return (
    <div>
      {entries.map(([key, value]) => {
        return ( 
          <div>
            <Text>
              {key}: {value}
            </Text>
          </div>
        )
      })}
    </div>
  )
}

export default DummyAssetCard